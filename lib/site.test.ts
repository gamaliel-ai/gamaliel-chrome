import { describe, expect, it } from 'vitest';
import { guessSiteName } from './site.ts';

describe('guessSiteName', () => {
  it('names apex hosts', () => {
    expect(guessSiteName('x.com')).toBe('Twitter (X)');
    expect(guessSiteName('twitter.com')).toBe('Twitter (X)');
    expect(guessSiteName('instagram.com')).toBe('Instagram');
  });

  it('names www, mobile, and other subdomains', () => {
    expect(guessSiteName('www.instagram.com')).toBe('Instagram');
    expect(guessSiteName('m.facebook.com')).toBe('Facebook');
    expect(guessSiteName('old.reddit.com')).toBe('Reddit');
    expect(guessSiteName('music.youtube.com')).toBe('YouTube');
    expect(guessSiteName('mobile.twitter.com')).toBe('Twitter (X)');
    expect(guessSiteName('bsky.app')).toBe('Bluesky');
    expect(guessSiteName('www.bsky.app')).toBe('Bluesky');
  });

  it('falls back to the hostname', () => {
    expect(guessSiteName('example.com')).toBe('example.com');
    expect(guessSiteName('nottwitter.com')).toBe('nottwitter.com');
  });
});
