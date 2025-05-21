"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRightIcon, BrainCircuit, CheckCircle2, Sparkles, Code, AlertCircle } from "lucide-react"
import { buildLLMChain, checkProviderHealth, OPENROUTER_FREE_MODELS } from "@/lib/api-services/llm-service"

export default function RefinementPage() {
  const [concept, setConcept] = useState("");
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<{ id: number; result: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [llmChain, setLlmChain] = useState<any[]>([]);
  const [loadingChain, setLoadingChain] = useState(true);
  const router = useRouter();

  // Build the dynamic chain on mount
  useEffect(() => {
    (async () => {
      setLoadingChain(true);
      const chain = await buildLLMChain();
      setLlmChain(chain);
      setLoadingChain(false);
    })();
  }, []);

  // Start process when chain and concept are ready
  useEffect(() => {
    const storedConcept = localStorage.getItem("appConcept");
    if (!storedConcept) {
      router.push("/concept");
      return;
    }
    setConcept(storedConcept);
    if (!loadingChain && llmChain.length > 0) {
      processLLMChain(storedConcept, 0, llmChain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingChain, llmChain, router]);

  // Robust process function with midstream fallback
  const processLLMChain = async (conceptText: string, modelIndex: number, chain: any[]) => {
    if (modelIndex >= chain.length) {
      setIsComplete(true);
      setProgress(100);
      return;
    }
    setCurrentModelIndex(modelIndex);
    const progressPerModel = 100 / chain.length;
    setProgress(modelIndex * progressPerModel);
    let prompt = conceptText;
    if (modelIndex > 0) {
      const previousResults = results.map((r) => r.result).join("\n\n");
      prompt = `Original Concept: ${conceptText}\n\nPrevious Analysis:\n${previousResults}\n\nPlease continue the refinement process.`;
    }
    let currentModel = chain[modelIndex];
    let triedModels = new Set();
    let success = false;
    let lastError = null;
    // Try current and fallback models if needed
    while (!success) {
      triedModels.add(currentModel.model || currentModel.provider);
      try {
        const response = await fetch("/api/llm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            stage: currentModel.name,
            provider: currentModel.provider,
            model: currentModel.model,
          }),
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setResults((prev) => [...prev, { id: currentModel.id, result: data.result }]);
        setProgress((modelIndex + 1) * progressPerModel);
        setTimeout(() => {
          processLLMChain(conceptText, modelIndex + 1, chain);
        }, 1000);
        success = true;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        // Try next available model (OpenRouter or other healthy)
        let fallback = null;
        // Prefer OpenRouter unused models
        if (currentModel.provider !== "openrouter") {
          for (const model of OPENROUTER_FREE_MODELS) {
            if (!triedModels.has(model)) {
              fallback = { ...currentModel, provider: "openrouter", model };
              break;
            }
          }
        }
        // If OpenRouter exhausted, try any other healthy provider
        if (!fallback) {
          for (const alt of chain) {
            if (!triedModels.has(alt.model || alt.provider) && alt.provider !== currentModel.provider) {
              fallback = alt;
              break;
            }
          }
        }
        // If no fallback found, error out
        if (!fallback) {
          setError(`All available models failed for this step. Last error: ${lastError}`);
          return;
        }
        currentModel = fallback;
      }
    }
  };

  const handleContinue = () => {
    localStorage.setItem("appResults", JSON.stringify(results));
    router.push("/results");
  };

  const handleRetry = () => {
    setError(null);
    processLLMChain(concept, currentModelIndex, llmChain);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-700 text-center mb-8">Refining Your App Concept</h1>

        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">Your App Concept</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 italic">"{concept}"</p>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Refinement Progress</span>
            <span className="text-sm font-medium text-slate-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {error && (
          <Card className="shadow-md mb-8 border-red-300 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Error Occurred</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Retry Current Step
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {loadingChain ? (
            <div className="text-center text-slate-500 py-8">Loading model chain...</div>
          ) : llmChain.length === 0 ? (
            <div className="text-center text-red-500 py-8">No available models in the chain.</div>
          ) : (
            llmChain.map((model: any, index: number) => {
              const ModelIcon = index === 0 ? BrainCircuit : index === 1 ? Sparkles : Code;
              const isActive = index === currentModelIndex && !error;
              const isCompleted = index < currentModelIndex || (index === currentModelIndex && isComplete);
              const result = results.find((r) => r.id === model.id);

              return (
                <Card
                  key={model.id}
                  className={`shadow-md transition-all ${isActive ? "border-indigo-500 bg-indigo-50" : ""}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <h3 className="text-lg font-semibold text-slate-700">{model.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full mb-1">
                        {model.provider}
                      </span>
                      {model.model && (
                        <span className="text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                          {model.model}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-full ${isActive || isCompleted ? "bg-indigo-100" : "bg-gray-100"} mr-4`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <ModelIcon className={`h-6 w-6 ${isActive ? "text-indigo-500" : "text-gray-400"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-600 mb-2">
                          {index === 0
                            ? "Analyzing app viability and market potential"
                            : index === 1
                              ? "Refining features and user experience"
                              : "Creating structured build instructions"}
                        </p>
                        {(isActive || isCompleted) && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            {isActive && !isCompleted && !error ? (
                              <div className="flex items-center text-slate-600">
                                <div className="mr-2 h-4 w-4 relative">
                                  <span className="absolute h-4 w-4 animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                  <span className="relative rounded-full h-3 w-3 bg-indigo-500"></span>
                                </div>
                                Processing with {model.provider}{model.model ? ` (${model.model})` : ""}...
                              </div>
                            ) : result ? (
                              <p className="text-slate-700 whitespace-pre-line">{result.result}</p>
                            ) : null}
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {isComplete && (
          <div className="mt-8 text-center">
            <Button onClick={handleContinue} className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 text-lg">
              View Results <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
