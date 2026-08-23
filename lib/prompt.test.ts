import { describe, expect, it } from 'vitest';
import { snapshotFromPage } from './capture.ts';
import {
  DEFAULT_QUESTION,
  SYSTEM_PROMPT,
  buildChatMessages,
  buildUserPrompt,
} from './prompt.ts';

const base = snapshotFromPage({
  url: 'https://x.com/someone/status/1',
  title: 'A heated thread',
  visibleText: 'Everyone is furious about the news.',
  selection: '',
});

describe('buildUserPrompt', () => {
  it('names the site and includes page text', () => {
    const prompt = buildUserPrompt(base);
    expect(prompt).toContain('I am on Twitter (X) (x.com).');
    expect(prompt).toContain('Here is what I am looking at right now.');
    expect(prompt).toContain('A heated thread');
    expect(prompt).toContain('Everyone is furious about the news.');
    expect(prompt).toContain(DEFAULT_QUESTION);
    expect(prompt).not.toContain('I selected this text:');
  });

  it('adds highlighted text when present', () => {
    const prompt = buildUserPrompt({ ...base, selection: 'bless those who curse you' });
    expect(prompt).toContain('I selected this text:');
    expect(prompt).toContain('"bless those who curse you"');
  });

  it('uses a custom question when provided', () => {
    const prompt = buildUserPrompt(base, 'What should I pray right now?');
    expect(prompt).toContain('What should I pray right now?');
    expect(prompt).not.toContain(DEFAULT_QUESTION);
  });
});

describe('buildChatMessages', () => {
  it('sends system instructions then the page as the user turn', () => {
    const messages = buildChatMessages(base);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual({ role: 'system', content: SYSTEM_PROMPT });
    expect(messages[1]?.role).toBe('user');
    expect(messages[1]?.content).toContain('x.com');
  });
});
