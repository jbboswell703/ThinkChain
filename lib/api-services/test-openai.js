require('dotenv').config();
const OpenAI = require("openai");

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log("Testing OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a free model for testing
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
