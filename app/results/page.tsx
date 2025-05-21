"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, Copy, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { buildLLMChain } from "@/lib/api-services/llm-service"

interface ResultItem {
  id: number
  result: string
}

interface ChainStep {
  id: number
  name: string
  provider: string
  model?: string
}

export default function ResultsPage() {
  const [concept, setConcept] = useState("")
  const [results, setResults] = useState<ResultItem[]>([])
  const [llmChain, setLlmChain] = useState<ChainStep[]>([])
  const [copied, setCopied] = useState(false)
  const [loadingChain, setLoadingChain] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Retrieve the concept and results from localStorage
    const storedConcept = localStorage.getItem("appConcept")
    const storedResults = localStorage.getItem("appResults")

    if (!storedConcept || !storedResults) {
      router.push("/concept")
      return
    }

    setConcept(storedConcept)
    setResults(JSON.parse(storedResults))
    // Also fetch the dynamic LLM chain
    (async () => {
      setLoadingChain(true)
      const chain = await buildLLMChain()
      setLlmChain(chain)
      setLoadingChain(false)
    })()
  }, [router])

  // Generate a refined app name based on the concept
  const getAppName = () => {
    if (concept.toLowerCase().includes("fitness")) return "FitTrackAI"
    if (concept.toLowerCase().includes("book")) return "BookBuddies"
    if (concept.toLowerCase().includes("productivity")) return "TaskSync"
    if (concept.toLowerCase().includes("marketplace")) return "LocalHarvest"
    if (concept.toLowerCase().includes("social")) return "SocialSphere"
    return "AppConcept"
  }

  const appName = getAppName()

  // Helper: get step by id
  const getStep = (id: number) => llmChain.find((s) => s.id === id)

  // Get the build instructions from the third LLM in the chain
  const getBuildInstructions = () => {
    const buildInstructions = results.find((r) => r.id === 3)
    return buildInstructions ? buildInstructions.result : "Build instructions not available."
  }

  // Format the build instructions for v0.dev
  const getV0Instructions = () => {
    // Extract key information from the build instructions
    const buildInstructions = getBuildInstructions()

    // Simple formatting for v0.dev - in a real app, this would be more sophisticated
    return `Create an app named ${appName} that ${concept.toLowerCase()}.
\n${buildInstructions}`
  }

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(getV0Instructions())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get concept analysis from the first LLM
  const getConceptAnalysis = () => {
    const analysis = results.find((r) => r.id === 1)
    return analysis ? analysis.result : "Concept analysis not available."
  }

  // Get feature optimization from the second LLM
  const getFeatureOptimization = () => {
    const features = results.find((r) => r.id === 2)
    return features ? features.result : "Feature optimization not available."
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-700 text-center mb-8">Your Refined App Concept</h1>

        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-700">{appName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">{concept}</p>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Refinement Summary</h3>
              <ul className="space-y-2">
                {[1, 2, 3].map((stepId) => {
                  const step = getStep(stepId)
                  return (
                    <li className="flex items-start" key={stepId}>
                      <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                        ✓
                      </span>
                      <span className="text-slate-600">
                        {step
                          ? `${step.name} by ${step.provider}${step.model ? ` (${step.model})` : ""}`
                          : `Step ${stepId}`}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="v0" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="v0">v0.dev Instructions</TabsTrigger>
            <TabsTrigger value="analysis">Concept Analysis</TabsTrigger>
            <TabsTrigger value="features">Feature Optimization</TabsTrigger>
          </TabsList>
          <TabsContent value="v0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>v0.dev Ready Instructions</CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopyInstructions} className="flex items-center">
                  {copied ? (
                    <>
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto max-h-[400px]">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{getV0Instructions()}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Concept Analysis (Gemini)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-gray-200 p-4 rounded-lg overflow-auto max-h-[400px]">
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-line">{getConceptAnalysis()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Optimization (Claude)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-gray-200 p-4 rounded-lg overflow-auto max-h-[400px]">
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-line">{getFeatureOptimization()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-2" /> Start Over
            </Button>
          </Link>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => window.open("https://v0.dev", "_blank")}
            >
              Open v0.dev <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button
              className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center"
              onClick={() => window.open("https://bolt.new", "_blank")}
            >
              Open bolt.new <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
