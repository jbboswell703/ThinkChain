import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "dummy" });
console.log('Created Anthropic instance:', anthropic);
