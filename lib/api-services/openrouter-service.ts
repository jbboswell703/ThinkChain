import { type LLMProvider } from "@/lib/api-services/llm-service"

export async function generateWithOpenRouter(prompt: string, systemPrompt: string) {
  try {
    // For OpenRouter, we'll combine the system prompt and user prompt
    const combinedPrompt = `${systemPrompt}\n\n${prompt}`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://thinkchain.com",
        "X-Title": "ThinkChain"
      },
      body: JSON.stringify({
        model: "openai/gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("No content found in OpenRouter response")
    }

    return {
      success: true,
      data: data.choices[0].message.content,
      provider: "openrouter" as LLMProvider,
    }
  } catch (error) {
    console.error("OpenRouter API Error:", error)
    return {
      success: false,
      data: undefined,
      error: `OpenRouter API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "openrouter" as LLMProvider,
    }
  }
}
