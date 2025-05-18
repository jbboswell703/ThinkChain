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

    return {
      success: true,
      data: data.choices[0].message.content,
      provider: "deepseek",
    }
  } catch (error) {
    console.error("Deepseek API Error:", error)
    return {
      success: false,
      error: `Deepseek API Error: ${error instanceof Error ? error.message : String(error)}`,
      provider: "deepseek",
    }
  }
}
