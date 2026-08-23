import { describe, expect, it } from 'vitest';
import { guessSiteName } from './site.ts';

describe('guessSiteName', () => {
  it('names known social hosts', () => {
    expect(guessSiteName('x.com')).toBe('Twitter (X)');
    expect(guessSiteName('www.instagram.com')).toBe('Instagram');
  });

  it('falls back to the hostname', () => {
    expect(guessSiteName('example.com')).toBe('example.com');
  });
});
