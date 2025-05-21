import { generateWithOpenAI } from "./openai-service.js"
import { generateWithGemini } from "./gemini-service.js"
import { generateWithAnthropic } from "./anthropic-service.js"
import { generateWithDeepseek } from "./deepseek-service.js"
import { generateWithHuggingFace } from "./huggingface-service.js"

export type LLMProvider = "openai" | "gemini" | "anthropic" | "deepseek" | "huggingface" | "openrouter"

export interface LLMResponse {
  success: boolean
  data: string | undefined
  provider: LLMProvider
  error?: string
}

export async function generateWithLLM(
  prompt: string,
  systemPrompt: string,
  provider: LLMProvider,
): Promise<LLMResponse> {
  switch (provider) {
    case "openai":
      return generateWithOpenAI(prompt, systemPrompt)
    case "gemini":
      return generateWithGemini(prompt, systemPrompt)
    case "anthropic":
      return generateWithAnthropic(prompt, systemPrompt)
    case "deepseek":
      return generateWithDeepseek(prompt, systemPrompt)
    case "huggingface":
      return generateWithHuggingFace(prompt, systemPrompt)
    default:
      return {
        success: false,
        data: undefined,
        error: `Unknown provider: ${provider}`,
        provider: "openai", // Default fallback
      }
  }
}

// System prompts for each stage of the LLM chain
export const SYSTEM_PROMPTS = {
  conceptAnalyzer: "You are a concept analyzer. Analyze the app concept and identify key features and requirements.",
  featureOptimizer: "You are a feature optimizer. Optimize the features for maximum user value and technical feasibility.",
  buildInstructionGenerator: "You are a build instruction generator. Generate detailed technical instructions for building the app.",
  codeGenerator: "You are a code generator. Generate optimized, maintainable code for the app features.",
  qualityAssurance: "You are a quality assurance expert. Review the code and generate comprehensive test cases and quality checks.",
}

// Define the LLM chain with provider assignments
// List of free OpenRouter models (as provided by the user)
export const OPENROUTER_FREE_MODELS = [
  'meta-llama/llama-4-maverick:free',
  'meta-llama/llama-4-scout:free',
  'moonshotai/kimi-vl-a3b-thinking:free',
  'nvidia/llama-3.1-nemotron-nano-8b-v1:free',
  'google/gemini-2.5-pro-exp-03-25:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
  'openrouter/optimus-alpha',
  'openrouter/quasar-alpha',
  'deepseek/deepseek-v3-base:free',
  'qwen/qwen2.5-vl-3b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'deepseek/deepseek-r1-zero:free',
  'nousresearch/deephermes-3-llama-3-8b-preview:free',
  'meta-llama/llama-3.3-8b-instruct:free',
  'deepseek/deepseek-v3-0324:free',
  'deepseek/deepseek-r1-zero:free',
  'nousresearch/deephermes-3-llama-3-8b-preview:free',
  'openrouter/optimus-alpha',
  'openrouter/quasar-alpha',
  'qwen/qwen2.5-vl-3b-instruct:free',
];

// Async health check for each provider
export async function checkProviderHealth(provider: LLMProvider): Promise<boolean> {
  try {
    switch (provider) {
      case "openai":
        const openaiResp = await generateWithOpenAI("ping", "healthcheck");
        return openaiResp.success;
      case "gemini":
        const geminiResp = await generateWithGemini("ping", "healthcheck");
        return geminiResp.success;
      case "anthropic":
        const anthropicResp = await generateWithAnthropic("ping", "healthcheck");
        return anthropicResp.success;
      case "deepseek":
        const deepseekResp = await generateWithDeepseek("ping", "healthcheck");
        return deepseekResp.success;
      case "huggingface":
        const hfResp = await generateWithHuggingFace("ping", "healthcheck");
        return hfResp.success;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

// Dynamic LLM chain builder
export async function buildLLMChain() {
  const baseChain = [
    {
      id: 1,
      name: "Concept Analyzer",
      provider: "gemini" as LLMProvider,
      systemPrompt: SYSTEM_PROMPTS.conceptAnalyzer,
    },
    {
      id: 2,
      name: "Feature Optimizer",
      provider: "anthropic" as LLMProvider,
      systemPrompt: SYSTEM_PROMPTS.featureOptimizer,
    },
    {
      id: 3,
      name: "Build Instruction Generator",
      provider: "openrouter" as LLMProvider,
      systemPrompt: SYSTEM_PROMPTS.buildInstructionGenerator,
    },
    {
      id: 4,
      name: "Code Generator",
      provider: "deepseek" as LLMProvider,
      systemPrompt: SYSTEM_PROMPTS.codeGenerator,
    },
    {
      id: 5,
      name: "Quality Assurance",
      provider: "huggingface" as LLMProvider,
      systemPrompt: SYSTEM_PROMPTS.qualityAssurance,
    },
  ];

  const workingChain = [];
  let openRouterModelIdx = 0;

  for (const stage of baseChain) {
    if (stage.provider === "openrouter") {
      // Always healthy, just assign next available model
      workingChain.push({ ...stage, provider: "openrouter", model: OPENROUTER_FREE_MODELS[openRouterModelIdx++] });
      continue;
    }
    if (await checkProviderHealth(stage.provider)) {
      workingChain.push(stage);
    } else {
      // Substitute with OpenRouter model
      workingChain.push({ ...stage, provider: "openrouter", model: OPENROUTER_FREE_MODELS[openRouterModelIdx++] });
    }
  }
  // Ensure at least 5 models
  while (workingChain.length < 5 && openRouterModelIdx < OPENROUTER_FREE_MODELS.length) {
    workingChain.push({
      id: workingChain.length + 1,
      name: `OpenRouter Fallback ${openRouterModelIdx + 1}`,
      provider: "openrouter" as LLMProvider,
      model: OPENROUTER_FREE_MODELS[openRouterModelIdx++],
      systemPrompt: "You are a helpful assistant.",
    });
  }
  return workingChain;
}
