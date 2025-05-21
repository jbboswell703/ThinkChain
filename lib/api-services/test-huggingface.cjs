require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = process.env.HF_API_KEY;
const url = 'https://api-inference.huggingface.co/models/gpt2';

(async () => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: 'Say hello in one sentence.' })
    });
    const data = await response.json();
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      console.log('HuggingFace API Success:', data[0].generated_text);
    } else {
      console.error('HuggingFace API Error:', data);
    }
  } catch (error) {
    console.error('HuggingFace API Exception:', error);
  }
})();
