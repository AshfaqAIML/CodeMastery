import type { AIProvider, ChatMessage, ChatOptions } from "./types"

/**
 * z-ai-web-dev-sdk provider.
 *
 * NOTE: z-ai-web-dev-sdk is the SDK available in THIS dev environment.
 * It is treated as one optional provider behind the AIService interface.
 * The application has NO hard dependency on it — if AI_ENABLED != true or
 * the provider is "none"/"openai", this code is never imported.
 */
export class ZAIProvider implements AIProvider {
  name = "zai"
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    // Lazy import so the SDK is an optional dependency
    const ZAISDKModule: any = await import("z-ai-web-dev-sdk")
    const ZAISDK = ZAISDKModule.default ?? ZAISDKModule.ZAISDK
    const apiKey = this.apiKey || (ZAISDKModule.API_KEY ?? "")
    const zai = await ZAISDK.create(apiKey)
    const res = await zai.chat.completions.create({
      messages: messages as any,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
      ...(options?.model ? { model: options.model } : {}),
    })
    return (res as any).choices?.[0]?.message?.content ?? ""
  }
}
