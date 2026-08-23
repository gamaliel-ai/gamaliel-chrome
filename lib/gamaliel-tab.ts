export const GAMALIEL_TAB_NAME = 'gamaliel';

export const GAMALIEL_TAB_URL_PATTERNS = [
  'https://gamaliel.ai/*',
  'https://www.gamaliel.ai/*',
];

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
