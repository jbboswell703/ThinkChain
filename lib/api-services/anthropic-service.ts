import Anthropic from "@anthropic-ai/sdk"

export async function generateWithAnthropic(prompt: string, systemPrompt: string) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    })

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    })

    return {
      success: true,
      data: response.content[0].text,
      provider: "anthropic",
    }
  } catch (error) {
    console.error("Anthropic API Error:", error)
    return {
      success: false,
      error: `Anthropic API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "anthropic",
    }
  }
}
