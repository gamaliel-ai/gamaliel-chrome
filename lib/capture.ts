export const MAX_PAGE_CHARS = 8_000;

export type PageSnapshot = {
  url: string;
  hostname: string;
  title: string;
  visibleText: string;
  selection: string;
};

export function normalizeVisibleText(raw: string, maxChars = MAX_PAGE_CHARS): string {
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= maxChars) return collapsed;
  return `${collapsed.slice(0, maxChars)}…`;
}

export function snapshotFromPage(input: {
  url: string;
  title: string;
  visibleText: string;
  selection: string;
}): PageSnapshot {
  let hostname = '';
  try {
    hostname = new URL(input.url).hostname;
  } catch {
    hostname = '';
  }
  return {
    url: input.url,
    hostname,
    title: input.title.trim(),
    visibleText: normalizeVisibleText(input.visibleText),
    selection: input.selection.replace(/\s+/g, ' ').trim(),
  };
}
