import { config } from "@/lib/config"
import type { AIService, AIProvider, ChatMessage, ChatOptions } from "./types"
import { ZAIProvider } from "./zai"
import { OpenAIProvider } from "./openai"

let _instance: AIServiceImpl | null = null

class AIServiceImpl implements AIService {
  enabled: boolean
  provider: AIProvider | null

  constructor() {
    this.enabled = config.ai.enabled
    this.provider = this.buildProvider()
  }

  private buildProvider(): AIProvider | null {
    if (!config.ai.enabled) return null
    const p = config.ai.provider
    if (p === "openai") {
      if (!config.ai.openai.apiKey) return null
      return new OpenAIProvider(
        config.ai.openai.apiKey,
        config.ai.openai.baseUrl,
        config.ai.openai.model
      )
    }
    if (p === "gemini") {
      if (!config.ai.gemini.apiKey) return null
      // Gemini is served through its OpenAI-compatible endpoint.
      return new OpenAIProvider(
        config.ai.gemini.apiKey,
        config.ai.gemini.baseUrl,
        config.ai.gemini.model,
        "gemini"
      )
    }
    if (p === "zai") {
      return new ZAIProvider(config.ai.zai.apiKey)
    }
    // "none" or unknown → no provider
    return null
  }

  async chat(messages: Parameters<AIProvider["chat"]>[0], options?: Parameters<AIProvider["chat"]>[1]): Promise<string> {
    if (!this.enabled || !this.provider) {
      throw new Error("AI service is not enabled or no provider is configured.")
    }
    return this.provider.chat(messages, options)
  }
}

export function getAI(): AIService {
  if (!_instance) _instance = new AIServiceImpl()
  return _instance
}

export type { AIService, AIProvider, ChatMessage, ChatOptions }
