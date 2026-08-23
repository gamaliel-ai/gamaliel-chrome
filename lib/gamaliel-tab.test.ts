import { describe, expect, it } from 'vitest';
import { pickGamalielTabId } from './gamaliel-tab.ts';

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
