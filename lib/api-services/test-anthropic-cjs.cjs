const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: "dummy" });
console.log("Anthropic client created:", client);
