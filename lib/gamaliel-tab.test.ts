import { describe, expect, it } from 'vitest';
import {
  ON_GAMALIEL_ENCOURAGEMENTS,
  encouragementForLoad,
  isGamalielPageUrl,
  nextEncouragementCycle,
  pickGamalielTabId,
} from './gamaliel-tab.ts';

describe('isGamalielPageUrl', () => {
  it('is true for the reader and www', () => {
    expect(isGamalielPageUrl('https://gamaliel.ai/read/MAT/5?verse=1')).toBe(
      true,
    );
    expect(isGamalielPageUrl('https://www.gamaliel.ai/')).toBe(true);
  });

  it('is false for other hosts and bad input', () => {
    expect(isGamalielPageUrl(undefined)).toBe(false);
    expect(isGamalielPageUrl('')).toBe(false);
    expect(isGamalielPageUrl('not-a-url')).toBe(false);
    expect(isGamalielPageUrl('https://x.com/foo')).toBe(false);
    expect(isGamalielPageUrl('https://api.gamaliel.ai/v1/chat')).toBe(false);
  });
});

describe('encouragements', () => {
  it('has twenty phrases and wraps', () => {
    expect(ON_GAMALIEL_ENCOURAGEMENTS).toHaveLength(20);
    expect(encouragementForLoad(0)).toBe(ON_GAMALIEL_ENCOURAGEMENTS[0]);
    expect(encouragementForLoad(20)).toBe(ON_GAMALIEL_ENCOURAGEMENTS[0]);
    expect(encouragementForLoad(21)).toBe(ON_GAMALIEL_ENCOURAGEMENTS[1]);
  });

  it('picks a random index from null, then cycles on a new URL', () => {
    const first = nextEncouragementCycle(
      null,
      'https://gamaliel.ai/read/MAT/5',
      () => 0.35,
    );
    expect(first).toEqual({
      index: 7,
      lastPassageUrl: 'https://gamaliel.ai/read/MAT/5',
    });

    const same = nextEncouragementCycle(first, 'https://gamaliel.ai/read/MAT/5');
    expect(same).toEqual(first);

    const next = nextEncouragementCycle(
      first,
      'https://gamaliel.ai/read/JHN/3',
    );
    expect(next?.index).toBe(8);
    expect(next?.lastPassageUrl).toBe('https://gamaliel.ai/read/JHN/3');
  });

  it('stays null off a Gamaliel tab when we have not started', () => {
    expect(nextEncouragementCycle(null, 'https://x.com/foo')).toBeNull();
  });

  it('does not advance off a non-Gamaliel tab', () => {
    const prev = {
      index: 3,
      lastPassageUrl: 'https://gamaliel.ai/read/MAT/5',
    };
    expect(nextEncouragementCycle(prev, 'https://x.com/foo')).toEqual(prev);
  });
});

describe('pickGamalielTabId', () => {
  it('returns undefined when nothing is open', () => {
    expect(pickGamalielTabId([])).toBeUndefined();
  });

  it('reuses the remembered tab when it is still open', () => {
    expect(
      pickGamalielTabId(
        [
          { id: 1, url: 'https://gamaliel.ai/read/MAT/5' },
          { id: 2, url: 'https://gamaliel.ai/' },
        ],
        2,
      ),
    ).toBe(2);
  });

  it('ignores a remembered id that was closed', () => {
    expect(
      pickGamalielTabId([{ id: 3, url: 'https://gamaliel.ai/read/JHN/3' }], 9),
    ).toBe(3);
  });

  it('prefers a reader tab over the homepage', () => {
    expect(
      pickGamalielTabId([
        { id: 1, url: 'https://gamaliel.ai/' },
        { id: 2, url: 'https://gamaliel.ai/read/ROM/8?verse=1' },
      ]),
    ).toBe(2);
  });
});
