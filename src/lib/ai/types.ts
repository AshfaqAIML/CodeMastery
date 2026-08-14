/**
 * AI service abstraction.
 *
 * AI functionality is OPTIONAL. The core learning platform works without any
 * AI provider configured. When AI_ENABLED=true, a provider is selected via
 * AI_PROVIDER and used for optional features (study buddy, summaries, etc).
 *
 * Providers:
 *   - "zai"    -> z-ai-web-dev-sdk (default in this dev env)
 *   - "openai"  -> OpenAI-compatible API
 *
 * To add a new provider, implement AIProvider and register it in the factory.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatOptions {
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AIProvider {
  name: string
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>
}

export interface AIService {
  enabled: boolean
  provider: AIProvider | null
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>
}
