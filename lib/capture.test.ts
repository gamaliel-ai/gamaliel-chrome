import { describe, expect, it } from 'vitest';
import {
  MAX_PAGE_CHARS,
  normalizeVisibleText,
  snapshotFromPage,
  visibleTextFromBlocks,
} from './capture.ts';

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

describe('visibleTextFromBlocks', () => {
  const viewport = { width: 800, height: 600 };

  it('keeps in-view text and drops scrolled-off prefix', () => {
    const above = 'NAV AND EARLY FEED '.repeat(500);
    const inView = 'THE POST THE USER IS LOOKING AT';
    const out = visibleTextFromBlocks(
      [
        { text: above, box: { top: -40_000, right: 800, bottom: -200, left: 0 } },
        { text: inView, box: { top: 80, right: 800, bottom: 240, left: 0 } },
      ],
      viewport,
    );
    expect(out).toContain(inView);
    expect(out).not.toContain('NAV AND EARLY FEED');
  });

  it('takes the on-screen slice of a tall block, not the document start', () => {
    const text = `${'AAAA'.repeat(2_000)}${'BBBB'.repeat(2_000)}${'CCCC'.repeat(2_000)}`;
    const out = visibleTextFromBlocks(
      [{ text, box: { top: -1_200, right: 800, bottom: 1_800, left: 0 } }],
      viewport,
    );
    expect(out).toContain('BBBB');
    expect(out).not.toMatch(/^A/);
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
