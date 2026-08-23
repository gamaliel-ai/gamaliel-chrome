export const MAX_PAGE_CHARS = 8_000;

export type PageSnapshot = {
  url: string;
  hostname: string;
  title: string;
  visibleText: string;
  selection: string;
};

export type ViewportSize = { width: number; height: number };

export type Box = { top: number; right: number; bottom: number; left: number };

export type PageTextBlock = { text: string; box: Box };

export function normalizeVisibleText(raw: string, maxChars = MAX_PAGE_CHARS): string {
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= maxChars) return collapsed;
  return `${collapsed.slice(0, maxChars)}…`;
}

export function boxIntersectsViewport(box: Box, viewport: ViewportSize): boolean {
  return (
    box.bottom > 0 &&
    box.top < viewport.height &&
    box.right > 0 &&
    box.left < viewport.width
  );
}

/** Keep the portion of a block that overlaps the viewport (character-proportional). */
export function textSliceInViewport(
  text: string,
  box: Box,
  viewport: ViewportSize,
): string {
  if (!boxIntersectsViewport(box, viewport)) return '';
  const height = box.bottom - box.top;
  if (height <= 0 || text.length === 0) return '';
  const visibleTop = Math.max(0, box.top);
  const visibleBottom = Math.min(viewport.height, box.bottom);
  const start = Math.floor((text.length * (visibleTop - box.top)) / height);
  const end = Math.ceil((text.length * (visibleBottom - box.top)) / height);
  return text.slice(Math.max(0, start), Math.min(text.length, end));
}

export function visibleTextFromBlocks(
  blocks: PageTextBlock[],
  viewport: ViewportSize,
  maxChars = MAX_PAGE_CHARS,
): string {
  const parts: string[] = [];
  for (const block of blocks) {
    const slice = textSliceInViewport(block.text, block.box, viewport);
    if (slice.trim()) parts.push(slice);
  }
  return normalizeVisibleText(parts.join(' '), maxChars);
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
