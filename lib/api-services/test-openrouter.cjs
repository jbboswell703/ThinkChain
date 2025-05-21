require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = process.env.OPENROUTER_API_KEY;
const url = 'https://openrouter.ai/api/v1/chat/completions';

(async () => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Say hello in one sentence.' }
        ],
        max_tokens: 100
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      console.log('OpenRouter API Success:', data.choices[0].message.content);
    } else {
      console.error('OpenRouter API Error:', data);
    }
  } catch (error) {
    console.error('OpenRouter API Exception:', error);
  }
})();
