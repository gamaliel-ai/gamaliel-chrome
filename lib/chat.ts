import OpenAI from 'openai';

const DEFAULT_BASE_URL = 'https://api.gamaliel.ai/v1';

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
  apiKey: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  theology: string;
  profile: string;
  onDelta: (text: string) => void;
  baseURL?: string;
}): Promise<void> {
  const client = new OpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseURL ?? DEFAULT_BASE_URL,
    dangerouslyAllowBrowser: true,
  });

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
}
