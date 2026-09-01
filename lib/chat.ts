import OpenAI, { RateLimitError } from 'openai';

const DEFAULT_BASE_URL = 'https://api.gamaliel.ai/v1';

/** SDK requires a string; hosted mode ignores credentials when Authorization is omitted. */
const HOSTED_PLACEHOLDER_KEY = 'hosted';

export const HOSTED_RATE_LIMIT_MESSAGE =
  'Too many requests. Please try again shortly.';

export function chatRequestBody(options: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  theology: string;
  profile: string;
}) {
  return {
    model: 'gpt-4.1-mini',
    messages: options.messages,
    stream: true as const,
    theology: options.theology,
    profile: options.profile,
  };
}

export async function streamGamalielAnswer(options: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  theology: string;
  profile: string;
  onDelta: (text: string) => void;
  baseURL?: string;
}): Promise<void> {
  const client = new OpenAI({
    apiKey: HOSTED_PLACEHOLDER_KEY,
    baseURL: options.baseURL ?? DEFAULT_BASE_URL,
    dangerouslyAllowBrowser: true,
    maxRetries: 0,
    defaultHeaders: {
      Authorization: null,
      'X-Gamaliel-Client': 'chrome-extension',
    },
  });

  try {
    const stream = await client.chat.completions.create(
      chatRequestBody({
        messages: options.messages,
        theology: options.theology,
        profile: options.profile,
      }),
    );

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) options.onDelta(delta);
    }
  } catch (err) {
    if (err instanceof RateLimitError) {
      throw new Error(HOSTED_RATE_LIMIT_MESSAGE);
    }
    throw err;
  }
}
