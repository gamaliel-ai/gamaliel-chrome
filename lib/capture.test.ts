import { describe, expect, it } from 'vitest';
import { MAX_PAGE_CHARS, normalizeVisibleText, snapshotFromPage } from './capture.ts';

describe('normalizeVisibleText', () => {
  it('collapses whitespace', () => {
    expect(normalizeVisibleText('  hello \n\n world  ')).toBe('hello world');
  });

  it('truncates long pages', () => {
    const long = 'a'.repeat(MAX_PAGE_CHARS + 50);
    const out = normalizeVisibleText(long);
    expect(out.length).toBe(MAX_PAGE_CHARS + 1);
    expect(out.endsWith('…')).toBe(true);
  });
});

describe('snapshotFromPage', () => {
  it('parses hostname and trims selection', () => {
    const snap = snapshotFromPage({
      url: 'https://x.com/foo',
      title: '  a post  ',
      visibleText: 'visible',
      selection: '  highlighted \n text  ',
    });
    expect(snap.hostname).toBe('x.com');
    expect(snap.title).toBe('a post');
    expect(snap.selection).toBe('highlighted text');
  });
});
