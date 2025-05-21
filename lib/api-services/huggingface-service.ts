import type { LLMProvider } from "./llm-service"

export async function generateWithHuggingFace(prompt: string, systemPrompt: string) {
  try {
    // For HuggingFace, we'll combine the system prompt and user prompt
    const combinedPrompt = `${systemPrompt}\n\n${prompt}`

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: combinedPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data[0] || !data[0].generated_text) {
      throw new Error("No text content found in HuggingFace response")
    }

    return {
      success: true,
      data: data[0].generated_text,
      provider: "huggingface" as LLMProvider,
    }
  } catch (error) {
    console.error("HuggingFace API Error:", error)
    return {
      success: false,
      data: undefined,
      error: `HuggingFace API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "huggingface" as LLMProvider,
    }
  }
}
