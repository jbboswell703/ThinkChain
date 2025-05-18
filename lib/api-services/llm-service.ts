import { generateWithOpenAI } from "./openai-service"
import { generateWithGemini } from "./gemini-service"
import { generateWithAnthropic } from "./anthropic-service"
import { generateWithDeepseek } from "./deepseek-service"
import { generateWithHuggingFace } from "./huggingface-service"

export type LLMProvider = "openai" | "gemini" | "anthropic" | "deepseek" | "huggingface"

export interface LLMResponse {
  success: boolean
  data?: string
  error?: string
  provider: LLMProvider
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
        error: `Unknown provider: ${provider}`,
        provider: "openai", // Default fallback
      }
  }
}

// System prompts for each stage of the LLM chain
export const SYSTEM_PROMPTS = {
  conceptAnalyzer: `You are an expert app concept analyzer. Your job is to analyze the viability and market potential of app ideas. 
  Provide constructive feedback on the concept's strengths and potential improvements. 
  Focus on market fit, user needs, and competitive landscape.`,

  featureOptimizer: `You are an expert feature optimizer for app development. 
  Your job is to refine the feature set of an app concept to maximize user engagement and technical feasibility.
  Suggest core features, nice-to-have features, and a minimum viable product approach.`,

  buildInstructionGenerator: `You are an expert build instruction generator for AI web builders like v0.dev and bolt.new.
  Your job is to create detailed, structured instructions for building the app concept.
  Include specific UI components, styling details, functionality descriptions, and data structures.
  Format your response in a way that can be directly copied into v0.dev or bolt.new.`,
}

// Define the LLM chain with provider assignments
export const LLM_CHAIN = [
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
    provider: "openai" as LLMProvider,
    systemPrompt: SYSTEM_PROMPTS.buildInstructionGenerator,
  },
]
