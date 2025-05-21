// import { generateWithOpenAI } from './openai-service.js';
// import { generateWithGemini } from './gemini-service.js';
// import { generateWithAnthropic } from './anthropic-service.js';
// import { generateWithDeepseek } from './deepseek-service.js';
// import { generateWithHuggingFace } from './huggingface-service.js';
// import { generateWithOpenRouter } from './openrouter-service.js';

// All service imports commented out for isolation.

function testNoop() {
  console.log("No service modules imported. If you see this, import isolation succeeded.");
    } else {
      console.error("Anthropic Error:", JSON.stringify(error));
    }
  }

  // Deepseek
  try {
    console.log("=== START Deepseek ===");
    console.log("\nTesting Deepseek...");
    console.log("DEEPSEEK_API_KEY:", process.env.DEEPSEEK_API_KEY ? 'SET' : 'NOT SET');
    const deepseekResult = await generateWithDeepseek(testPrompt, systemPrompt);
    console.log("Deepseek Response:", deepseekResult);
    console.log("=== END Deepseek ===");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Deepseek Error:", error.stack || error.message);
    } else {
      console.error("Deepseek Error:", JSON.stringify(error));
    }
  }

  // HuggingFace
  try {
    console.log("=== START HuggingFace ===");
    console.log("\nTesting HuggingFace...");
    console.log("HF_API_KEY:", process.env.HF_API_KEY ? 'SET' : 'NOT SET');
    const huggingfaceResult = await generateWithHuggingFace(testPrompt, systemPrompt);
    console.log("HuggingFace Response:", huggingfaceResult);
    console.log("=== END HuggingFace ===");
  } catch (error) {
    if (error instanceof Error) {
      console.error("HuggingFace Error:", error.stack || error.message);
    } else {
      console.error("HuggingFace Error:", JSON.stringify(error));
    }
  }

  // OpenRouter
  try {
    console.log("=== START OpenRouter ===");
    console.log("\nTesting OpenRouter...");
    console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET');
    const openrouterResult = await generateWithOpenRouter(testPrompt, systemPrompt);
    console.log("OpenRouter Response:", openrouterResult);
    console.log("=== END OpenRouter ===");
  } catch (error) {
    if (error instanceof Error) {
      console.error("OpenRouter Error:", error.stack || error.message);
    } else {
      console.error("OpenRouter Error:", JSON.stringify(error));
    }
  }

}

testServices();
