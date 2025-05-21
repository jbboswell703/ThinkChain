import { GoogleGenerativeAI } from "@google/generative-ai"
import type { LLMProvider } from "./llm-service"

export async function generateWithGemini(prompt: string, systemPrompt: string) {
  try {
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_LANGUAGE_API_KEY || "")

    // For Gemini, we combine system prompt and user prompt
    const combinedPrompt = `${systemPrompt}\n\n${prompt}`

    // Get the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Generate content
    const result = await model.generateContent(combinedPrompt)
    const response = result.response
    const text = response.text()

    if (!text) {
      throw new Error("No text content found in Gemini response")
    }

    return {
      success: true,
      data: text,
      provider: "gemini" as LLMProvider,
    }
  } catch (error) {
    console.error("Gemini API Error:", error)
    return {
      success: false,
      data: undefined,
      error: `Gemini API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "gemini" as LLMProvider,
    }
  }
}
