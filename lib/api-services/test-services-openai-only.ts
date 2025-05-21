import { generateWithOpenAI } from './openai-service.js';

async function testOpenAI() {
  const testPrompt = "What is the capital of France?";
  const systemPrompt = "You are a helpful assistant.";
  try {
    console.log("=== START OpenAI ===");
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');
    const openaiResult = await generateWithOpenAI(testPrompt, systemPrompt);
    console.log("OpenAI Response:", openaiResult);
    console.log("=== END OpenAI ===");
  } catch (error) {
    if (error instanceof Error) {
      console.error("OpenAI Error:", error.stack || error.message);
    } else {
      console.error("OpenAI Error:", JSON.stringify(error));
    }
  }
}

testOpenAI();
