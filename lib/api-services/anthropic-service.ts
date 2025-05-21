import Anthropic, { ContentBlock } from "@anthropic-ai/sdk"
import type { LLMProvider } from "./llm-service"

export async function generateWithAnthropic(prompt: string, systemPrompt: string) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "", // Note: Using the same API key as Gemini since it's the same value in .env
    })

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240240",
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    })

    // Handle different types of content blocks
    const content = response.content.find((block: ContentBlock) => block.type === "text")
    if (!content || !content.text) {
      throw new Error("No text content found in response")
    }

    return {
      success: true,
      data: content.text,
      provider: "anthropic" as LLMProvider,
    }
  } catch (error) {
    console.error("Anthropic API Error:", error)
    return {
      success: false,
      data: undefined,
      error: `Anthropic API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "anthropic" as LLMProvider,
    }
  }
}
