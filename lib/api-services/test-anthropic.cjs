require('dotenv').config();
const Anthropic = require("@anthropic-ai/sdk");
const apiKey = process.env.ANTHROPIC_API_KEY || "dummy";

const client = new Anthropic({ apiKey });
console.log("Anthropic client created:", client);

(async () => {
  try {
    const response = await client.messages.create({
      model: "claude-3-opus-20240240",
      system: "You are a helpful assistant.",
      messages: [{ role: "user", content: "Say hello in one sentence." }],
      max_tokens: 100,
    });
    const content = response.content.find(block => block.type === "text");
    if (!content || !content.text) throw new Error("No text content found in response");
    console.log("Anthropic API Success:", content.text);
  } catch (error) {
    console.error("Anthropic API Error:", error);
  }
})();
