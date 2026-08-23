const HOST_LABELS: Record<string, string> = {
  'x.com': 'Twitter (X)',
  'twitter.com': 'Twitter (X)',
  'instagram.com': 'Instagram',
  'www.instagram.com': 'Instagram',
  'facebook.com': 'Facebook',
  'www.facebook.com': 'Facebook',
  'reddit.com': 'Reddit',
  'www.reddit.com': 'Reddit',
  'youtube.com': 'YouTube',
  'www.youtube.com': 'YouTube',
  'news.ycombinator.com': 'Hacker News',
};

export function guessSiteName(hostname: string): string {
  const host = hostname.replace(/^www\./, '').toLowerCase();
  return HOST_LABELS[hostname.toLowerCase()] ?? HOST_LABELS[host] ?? hostname;
}
