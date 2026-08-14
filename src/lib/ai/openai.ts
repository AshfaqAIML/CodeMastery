import type { AIProvider, ChatMessage, ChatOptions } from "./types"

/**
 * OpenAI-compatible provider. Works with any OpenAI-API-compatible endpoint
 * (OpenAI, Together, Groq, Anyscale, local llama-server, etc).
 *
 * Requires no SDK — uses fetch only, so it adds zero dependencies.
 */
export class OpenAIProvider implements AIProvider {
  name = "openai"
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
    private readonly model: string
  ) {}

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model ?? this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
      }),
    })
    if (!res.ok) {
      throw new Error(`OpenAI provider error ${res.status}: ${await res.text()}`)
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? ""
  }
}
