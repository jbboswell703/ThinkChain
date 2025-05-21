import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log("Testing OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the capital of France?" },
      ],
      temperature: 0.7,
    });

    console.log("OpenAI Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Error:", error);
  }
}

testOpenAI();
