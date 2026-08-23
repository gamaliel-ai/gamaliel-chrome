import {
  GAMALIEL_TAB_URL_PATTERNS,
  pickGamalielTabId,
} from './gamaliel-tab.ts';

let rememberedTabId: number | undefined;

export async function openInSharedGamalielTab(url: string): Promise<void> {
  const existing = await browser.tabs.query({ url: GAMALIEL_TAB_URL_PATTERNS });
  const id = pickGamalielTabId(existing, rememberedTabId);

  if (id != null) {
    const updated = await browser.tabs.update(id, { url, active: true });
    rememberedTabId = updated?.id ?? id;
    if (updated?.windowId != null) {
      try {
        await browser.windows.update(updated.windowId, { focused: true });
      } catch {
        // Same-window tab focus is enough; other-window focus is best-effort.
      }
    }
    return;
  }

  const created = await browser.tabs.create({ url });
  rememberedTabId = created.id;
}
