export const GAMALIEL_TAB_NAME = 'gamaliel';

export const GAMALIEL_TAB_URL_PATTERNS = [
  'https://gamaliel.ai/*',
  'https://www.gamaliel.ai/*',
];

export const ON_GAMALIEL_ENCOURAGEMENTS = [
  'Stay in the Word.',
  'Good. Keep reading.',
  "You're in Scripture. That's the point.",
  "Congratulations — you're in the Word.",
  'This is better than doomscrolling.',
  'Linger here.',
  'Let the text speak.',
  'Take your time.',
  'Stay a little longer.',
  'The Word is worth the minutes.',
  'Read it again.',
  'Sit with this.',
  "You're where you meant to be.",
  'Keep going.',
  "Don't rush past this.",
  'Let this land.',
  'More Word, less noise.',
  'Abide here.',
  'One more verse.',
  'Remain in the Word.',
] as const;

export const ON_GAMALIEL_PAGE_HINT = ON_GAMALIEL_ENCOURAGEMENTS[0];

export type EncouragementCycle = {
  index: number;
  lastPassageUrl?: string;
};

export function encouragementForLoad(loadIndex: number): string {
  const n = ON_GAMALIEL_ENCOURAGEMENTS.length;
  const i = ((loadIndex % n) + n) % n;
  return ON_GAMALIEL_ENCOURAGEMENTS[i] ?? ON_GAMALIEL_ENCOURAGEMENTS[0];
}

/** Advance only when the reader URL changes to a new passage. */
export function nextEncouragementCycle(
  prev: EncouragementCycle | null,
  url: string | undefined,
  random: () => number = Math.random,
): EncouragementCycle | null {
  if (!isGamalielPageUrl(url) || !url) return prev;
  if (prev === null) {
    const n = ON_GAMALIEL_ENCOURAGEMENTS.length;
    return {
      index: Math.floor(random() * n),
      lastPassageUrl: url,
    };
  }
  if (url === prev.lastPassageUrl) return prev;
  return { index: prev.index + 1, lastPassageUrl: url };
}

export function isGamalielPageUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === 'gamaliel.ai' || host === 'www.gamaliel.ai';
  } catch {
    return false;
  }
}

type TabLike = { id?: number; url?: string };

/** Prefer a remembered tab, then a reader tab, then any Gamaliel tab. */
export function pickGamalielTabId(
  tabs: TabLike[],
  rememberedId?: number,
): number | undefined {
  const ids = new Set(
    tabs.map((tab) => tab.id).filter((id): id is number => id != null),
  );
  if (rememberedId != null && ids.has(rememberedId)) return rememberedId;

  const reader = tabs.find((tab) => tab.id != null && tab.url?.includes('/read/'));
  if (reader?.id != null) return reader.id;

  return tabs.find((tab) => tab.id != null)?.id;
}
