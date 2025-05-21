import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function setupGemini(): Promise<GoogleGenAI> {
  return new GoogleGenAI({
    apiKey: process.env.GENERATIVE_LANGUAGE_API_KEY
  });
}


async function testGemini(genAI: GoogleGenAI) {
  try {
    console.log("Testing Gemini...");
    
    // Generate content
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: 'What is the capital of France?',
    });
    console.log("Gemini Response:", response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

// Run the test
async function runTest() {
  try {
    const genAI = await setupGemini();
    await testGemini(genAI);
  } catch (error) {
    console.error("Error running test:", error);
  }
}

runTest();
