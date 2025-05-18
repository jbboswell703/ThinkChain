"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRightIcon, BrainCircuit, CheckCircle2, Sparkles, Code, AlertCircle } from "lucide-react"
import { LLM_CHAIN } from "@/lib/api-services/llm-service"

export default function RefinementPage() {
  const [concept, setConcept] = useState("")
  const [currentModelIndex, setCurrentModelIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<{ id: number; result: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Retrieve the concept from localStorage
    const storedConcept = localStorage.getItem("appConcept")
    if (!storedConcept) {
      router.push("/concept")
      return
    }
    setConcept(storedConcept)

    // Start the LLM chain process
    processLLMChain(storedConcept, 0)
  }, [router])

  const processLLMChain = async (conceptText: string, modelIndex: number) => {
    if (modelIndex >= LLM_CHAIN.length) {
      // All models have completed
      setIsComplete(true)
      setProgress(100)
      return
    }

    setCurrentModelIndex(modelIndex)

    // Calculate progress percentage based on current model
    const progressPerModel = 100 / LLM_CHAIN.length
    setProgress(modelIndex * progressPerModel)

    try {
      // Prepare the prompt based on the stage
      let prompt = conceptText

      // If we're not at the first stage, include previous results
      if (modelIndex > 0) {
        const previousResults = results.map((r) => r.result).join("\n\n")
        prompt = `Original Concept: ${conceptText}\n\nPrevious Analysis:\n${previousResults}\n\nPlease continue the refinement process.`
      }

      const currentModel = LLM_CHAIN[modelIndex]

      // Make the API call
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          stage:
            modelIndex === 0 ? "conceptAnalyzer" : modelIndex === 1 ? "featureOptimizer" : "buildInstructionGenerator",
          provider: currentModel.provider,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Store the result
      setResults((prev) => [...prev, { id: currentModel.id, result: data.result }])

      // Update progress
      setProgress((modelIndex + 1) * progressPerModel)

      // Process the next model after a short delay
      setTimeout(() => {
        processLLMChain(conceptText, modelIndex + 1)
      }, 1000)
    } catch (err) {
      console.error("Error in LLM chain:", err)
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const handleContinue = () => {
    // Store results in localStorage for the results page
    localStorage.setItem("appResults", JSON.stringify(results))
    router.push("/results")
  }

  const handleRetry = () => {
    setError(null)
    processLLMChain(concept, currentModelIndex)
  }

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
          {LLM_CHAIN.map((model, index) => {
            const ModelIcon = index === 0 ? BrainCircuit : index === 1 ? Sparkles : Code
            const isActive = index === currentModelIndex && !error
            const isCompleted = index < currentModelIndex || (index === currentModelIndex && isComplete)
            const result = results.find((r) => r.id === model.id)

            return (
              <Card
                key={model.id}
                className={`shadow-md transition-all ${isActive ? "border-indigo-500 bg-indigo-50" : ""}`}
              >
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
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-lg font-semibold text-slate-700">{model.name}</h3>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                          {model.provider}
                        </span>
                      </div>
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
                              Processing with {model.provider}...
                            </div>
                          ) : result ? (
                            <p className="text-slate-700 whitespace-pre-line">{result.result}</p>
                          ) : null}
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
