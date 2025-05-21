import dotenv from 'dotenv';
dotenv.config();

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('GENERATIVE_LANGUAGE_API_KEY:', process.env.GENERATIVE_LANGUAGE_API_KEY);
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY);
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY);
console.log('HF_API_KEY:', process.env.HF_API_KEY);
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);
