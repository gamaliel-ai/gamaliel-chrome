import { describe, expect, it } from 'vitest';
import { absolutizeGamalielLinks, toGamalielHref } from './scripture-links.ts';

describe('toGamalielHref', () => {
  it('prefixes relative reader paths', () => {
    expect(toGamalielHref('/read/MAT/5?verse=1-16')).toBe(
      'https://gamaliel.ai/read/MAT/5?verse=1-16',
    );
  });

  it('leaves other hrefs alone', () => {
    expect(toGamalielHref('https://example.com')).toBe('https://example.com');
  });
});

describe('absolutizeGamalielLinks', () => {
  it('rewrites markdown scripture links from the API', () => {
    const md = 'See [Matthew 5:1-16](/read/MAT/5?verse=1-16) and keep going.';
    expect(absolutizeGamalielLinks(md)).toBe(
      'See [Matthew 5:1-16](https://gamaliel.ai/read/MAT/5?verse=1-16) and keep going.',
    );
  });
});
