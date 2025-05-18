import { NextResponse } from "next/server"
import { generateWithLLM, type LLMProvider, SYSTEM_PROMPTS } from "@/lib/api-services/llm-service"

export async function POST(request: Request) {
  try {
    const { prompt, stage, provider } = await request.json()

    // Determine which system prompt to use based on the stage
    let systemPrompt = ""
    if (stage === "conceptAnalyzer") {
      systemPrompt = SYSTEM_PROMPTS.conceptAnalyzer
    } else if (stage === "featureOptimizer") {
      systemPrompt = SYSTEM_PROMPTS.featureOptimizer
    } else if (stage === "buildInstructionGenerator") {
      systemPrompt = SYSTEM_PROMPTS.buildInstructionGenerator
    } else {
      // Default system prompt
      systemPrompt = "You are a helpful AI assistant."
    }

    // Generate response using the specified provider
    const response = await generateWithLLM(prompt, systemPrompt, provider as LLMProvider)

    if (response.success) {
      return NextResponse.json({ result: response.data, provider: response.provider })
    } else {
      return NextResponse.json({ error: response.error, provider: response.provider }, { status: 500 })
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      { error: `Error processing request: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
