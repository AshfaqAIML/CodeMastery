/**
 * AI service abstraction.
 *
 * AI functionality is OPTIONAL. The core learning platform works without any
 * AI provider configured. When AI_ENABLED=true, a provider is selected via
 * AI_PROVIDER and used for optional features (study buddy, summaries, etc).
 *
 * Providers:
 *   - "none"   -> default; AI disabled (platform works fully without it)
 *   - "gemini" -> Google Gemini via its OpenAI-compatible endpoint
 *   - "openai" -> OpenAI-compatible API (OpenAI, Together, Groq, local, ...)
 *   - "zai"    -> z-ai-web-dev-sdk (optional dependency, lazy-imported)
 *
 * To add a new provider, implement AIProvider and register it in the factory
 * (src/lib/ai/index.ts).
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
