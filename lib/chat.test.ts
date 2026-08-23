import { describe, expect, it } from 'vitest';
import { chatRequestBody } from './chat.ts';

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
