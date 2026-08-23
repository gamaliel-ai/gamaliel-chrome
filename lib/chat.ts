import OpenAI from 'openai';

const DEFAULT_BASE_URL = 'https://api.gamaliel.ai/v1';

export async function streamGamalielAnswer(options: {
  apiKey: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  onDelta: (text: string) => void;
  baseURL?: string;
}): Promise<void> {
  const client = new OpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseURL ?? DEFAULT_BASE_URL,
    dangerouslyAllowBrowser: true,
  });

  const stream = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: options.messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) options.onDelta(delta);
  }
}
