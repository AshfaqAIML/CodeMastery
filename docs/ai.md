# AI (Optional)

AI features in CodeMastery are **optional**. The core learning platform (tutorials, quizzes, progress, gamification, search) works fully without any AI provider configured.

## Architecture

```
AIService (interface)
    └── provider selected via AI_PROVIDER
        ├── "zai"    -> ZAIProvider  (z-ai-web-dev-sdk, lazy import)
        ├── "openai" -> OpenAIProvider (fetch-based, OpenAI-compatible)
        └── "none"   -> null (AI disabled)
```

The SDKs are imported **lazily**, so:
- `z-ai-web-dev-sdk` is only required when `AI_PROVIDER=zai` and `AI_ENABLED=true`.
- No SDK is required for OpenAI (uses `fetch`).
- If `AI_ENABLED=false`, no AI code runs at all.

## Enabling AI

### Option A — Z.AI (dev environment default)

```env
AI_ENABLED=true
AI_PROVIDER=zai
ZAI_API_KEY=your-zai-api-key
```

### Option B — OpenAI-compatible (any provider)

Works with OpenAI, Together, Groq, Anyscale, local llama-server, etc.

```env
AI_ENABLED=true
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

For a local model via [llama.cpp server](https://github.com/ggerganov/llama.cpp):

```env
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_API_KEY=not-required
OPENAI_MODEL=local-model
```

## Interface

```ts
interface AIProvider {
  name: string
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>
}
interface AIService {
  enabled: boolean
  provider: AIProvider | null
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>
}
```

Usage in a route handler:

```ts
import { getAI } from "@/lib/ai"

const ai = getAI()
if (!ai.enabled) {
  return err("AI features are not enabled on this deployment.", 503)
}
const answer = await ai.chat([
  { role: "system", content: "You are a helpful CS tutor." },
  { role: "user", content: userQuestion },
])
```

## Adding a new provider

1. Create `<provider>.ts` implementing `AIProvider`.
2. Register it in `src/lib/ai/index.ts` based on `config.ai.provider`.
3. Lazy-import the SDK.

## Portability guarantee

Because AI is fully optional and provider-pluggable, the deployment can:
- Run with no AI (default).
- Run with Z.AI in the dev environment.
- Switch to OpenAI, a local model, or any other OpenAI-compatible provider in production — by changing env vars only.
