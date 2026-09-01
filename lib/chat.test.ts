import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  HOSTED_RATE_LIMIT_MESSAGE,
  chatRequestBody,
  streamGamalielAnswer,
} from './chat.ts';

describe('chatRequestBody', () => {
  it('includes local theology and profile slugs', () => {
    const body = chatRequestBody({
      messages: [{ role: 'user', content: 'hello' }],
      theology: 'reformed',
      profile: 'mature_believer',
    });
    expect(body.theology).toBe('reformed');
    expect(body.profile).toBe('mature_believer');
    expect(body.stream).toBe(true);
  });
});

describe('streamGamalielAnswer', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const streamOpts = {
    messages: [{ role: 'user' as const, content: 'hello' }],
    theology: 'reformed',
    profile: 'mature_believer',
    onDelta: () => {},
    baseURL: 'https://api.example.test/v1',
  };

  it('omits Authorization and sends X-Gamaliel-Client', async () => {
    let headers: Headers | undefined;
    vi.stubGlobal(
      'fetch',
      async (_input: RequestInfo, init?: RequestInit) => {
        headers = new Headers(init?.headers);
        return new Response(JSON.stringify({ error: { message: 'limited' } }), {
          status: 429,
          headers: { 'content-type': 'application/json' },
        });
      },
    );

    await expect(streamGamalielAnswer(streamOpts)).rejects.toThrow(
      HOSTED_RATE_LIMIT_MESSAGE,
    );
    expect(headers?.has('Authorization')).toBe(false);
    expect(headers?.get('X-Gamaliel-Client')).toBe('chrome-extension');
  });

  it('maps HTTP 429 to a retry-shortly message', async () => {
    vi.stubGlobal('fetch', async () => {
      return new Response(JSON.stringify({ error: { message: 'rate' } }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      });
    });

    await expect(streamGamalielAnswer(streamOpts)).rejects.toThrow(
      HOSTED_RATE_LIMIT_MESSAGE,
    );
  });
});
