import type { AIProvider, ChatMessage, ChatOptions } from "./types"

/**
 * z-ai-web-dev-sdk provider.
 *
 * In this dev environment, the SDK manages its own authentication.
 * The application has NO hard dependency on it — if AI_ENABLED != true or
 * the provider is "none"/"openai", this code is never imported.
 *
 * For deployment outside this environment, set ZAI_API_KEY in .env.
 */
export class ZAIProvider implements AIProvider {
  name = "zai"
  private apiKey: string

  constructor(apiKey: string = "") {
    this.apiKey = apiKey
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    // Lazy import so the SDK is an optional dependency
    const ZAISDKModule: any = await import("z-ai-web-dev-sdk")
    const ZAISDK = ZAISDKModule.default ?? ZAISDKModule.ZAISDK

    // Try multiple auth approaches
    let zai: any
    if (this.apiKey) {
      zai = await ZAISDK.create(this.apiKey)
    } else if (ZAISDKModule.API_KEY) {
      zai = await ZAISDK.create(ZAISDKModule.API_KEY)
    } else {
      // SDK may manage its own auth in certain environments
      zai = await ZAISDK.create()
    }

    const res = await zai.chat.completions.create({
      messages: messages as any,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
      ...(options?.model ? { model: options.model } : {}),
    })
    return (res as any).choices?.[0]?.message?.content ?? ""
  }
}
