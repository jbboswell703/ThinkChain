import type { LLMProvider } from "./llm-service"

export async function generateWithDeepseek(prompt: string, systemPrompt: string) {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("No content found in Deepseek response")
    }

    return {
      success: true,
      data: data.choices[0].message.content,
      provider: "deepseek" as LLMProvider,
    }
  } catch (error) {
    console.error("Deepseek API Error:", error)
    return {
      success: false,
      data: undefined,
      error: `Deepseek API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "deepseek" as LLMProvider,
    }
  }
}
