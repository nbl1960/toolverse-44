/**
 * Shared Gemini API client. Both AI-powered tools (Email Writer, the
 * YouTube generator suite) call `generateGeminiText()` instead of each
 * instantiating their own client — one implementation, no duplicated
 * request/response/error handling.
 *
 * Deliberately a plain `fetch()` call to Gemini's REST endpoint rather
 * than the `@google/generative-ai` (or `@google/genai`) SDK: `fetch` is a
 * native Web API supported identically in every runtime this app might
 * ever run in — Node.js locally, and Cloudflare Workers in production —
 * with zero risk of an SDK depending on a Node-only API that doesn't
 * exist in the Workers runtime.
 */

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
  finishReason?: string;
}

interface GeminiResponseBody {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
}

export class GeminiRequestError extends Error {}

export interface GeminiGenerationConfig {
  /** Lower = more deterministic/faster to converge. Omitted entirely unless a caller opts in. */
  temperature?: number;
  /** Hard cap on response length — keeps latency bounded for callers that only need a short, structured answer. */
  maxOutputTokens?: number;
  /**
   * Set to "application/json" together with `responseSchema` to constrain
   * Gemini's output at the token-sampling level — the response is
   * guaranteed to be valid JSON matching the schema's shape, not just
   * "asked nicely" via prompt instructions. This is what actually
   * prevents malformed-JSON parse failures, rather than only cleaning
   * up the string after the fact.
   */
  responseMimeType?: string;
  /** OpenAPI-3.0-subset JSON schema (Gemini's REST wire format — plain lowercase `type` strings, not an SDK enum). */
  responseSchema?: Record<string, unknown>;
}

/**
 * Sends a single-turn text prompt to Gemini and returns the model's text
 * response. Throws `GeminiRequestError` with a caller-friendly message on
 * any failure (network error, non-2xx response, safety block, or an
 * unexpected response shape) — callers can catch this and surface
 * `error.message` directly to the user.
 *
 * `generationConfig` is optional and additive: every existing caller
 * that doesn't pass it gets byte-identical behavior to before. Callers
 * with a tight latency budget (the AI Assistant) can opt into a lower
 * temperature and a token cap to keep responses fast and consistent.
 */
export async function generateGeminiText(
  prompt: string,
  apiKey: string,
  generationConfig?: GeminiGenerationConfig
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        ...(generationConfig ? { generationConfig } : {}),
      }),
    });
  } catch {
    throw new GeminiRequestError("Couldn't reach the Gemini API. Check your network and try again.");
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 400) {
      throw new GeminiRequestError("Gemini rejected the request — check that GEMINI_API_KEY is valid.");
    }
    if (status === 401 || status === 403) {
      throw new GeminiRequestError("Gemini API key is missing or invalid.");
    }
    if (status === 429) {
      throw new GeminiRequestError("Gemini rate limit reached. Wait a moment and try again.");
    }
    throw new GeminiRequestError(`Gemini API returned an error (status ${status}).`);
  }

  let data: GeminiResponseBody;
  try {
    data = (await response.json()) as GeminiResponseBody;
  } catch {
    throw new GeminiRequestError("Gemini returned a response that couldn't be parsed.");
  }

  if (data.promptFeedback?.blockReason) {
    throw new GeminiRequestError(
      `Gemini declined to respond to this request (${data.promptFeedback.blockReason}). Try rephrasing.`
    );
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiRequestError("Gemini did not return any text.");
  }

  return text;
}
