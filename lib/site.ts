const SITE_PATTERNS: { test: RegExp; name: string }[] = [
  { test: /(^|\.)(x|twitter)\.com$/i, name: 'Twitter (X)' },
  { test: /(^|\.)(bsky\.app|bsky\.social)$/i, name: 'Bluesky' },
  { test: /(^|\.)instagram\.com$/i, name: 'Instagram' },
  { test: /(^|\.)facebook\.com$/i, name: 'Facebook' },
  { test: /(^|\.)reddit\.com$/i, name: 'Reddit' },
  { test: /(^|\.)(youtube\.com|youtu\.be)$/i, name: 'YouTube' },
  { test: /(^|\.)news\.ycombinator\.com$/i, name: 'Hacker News' },
];

export function guessSiteName(hostname: string): string {
  const host = hostname.toLowerCase();
  return SITE_PATTERNS.find(({ test }) => test.test(host))?.name ?? hostname;
}
