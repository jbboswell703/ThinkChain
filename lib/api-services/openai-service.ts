import OpenAI from "openai"
import type { LLMProvider } from "./llm-service"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateWithOpenAI(prompt: string, systemPrompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    })

    if (!response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
      throw new Error("No content found in OpenAI response")
    }

    return {
      success: true,
      data: response.choices[0].message.content,
      provider: "openai" as LLMProvider,
    }
  } catch (error) {
    console.error("OpenAI API Error:", error)
    return {
      success: false,
      data: undefined,
      error: `OpenAI API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "openai" as LLMProvider,
    }
  }
}
