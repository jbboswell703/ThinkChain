import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateWithGemini(prompt: string, systemPrompt: string) {
  try {
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")

    // For Gemini, we combine system prompt and user prompt
    const combinedPrompt = `${systemPrompt}\n\n${prompt}`

    // Get the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Generate content
    const result = await model.generateContent(combinedPrompt)
    const response = result.response
    const text = response.text()

    return {
      success: true,
      data: text,
      provider: "gemini",
    }
  } catch (error) {
    console.error("Gemini API Error:", error)
    return {
      success: false,
      error: `Gemini API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "gemini",
    }
  }
}
