import { snapshotFromPage, type PageSnapshot } from '@/lib/capture.ts';
import { streamGamalielAnswer } from '@/lib/chat.ts';
import { isGamalielPageUrl, ON_GAMALIEL_PAGE_HINT } from '@/lib/gamaliel-tab.ts';
import type { BackgroundToPanel, CaptureResponse, PanelToBackground } from '@/lib/messages.ts';
import { loadPreferences } from '@/lib/preferences.ts';
import { buildChatMessages } from '@/lib/prompt.ts';

function apiKey(): string {
  return import.meta.env.WXT_GAMALIEL_API_KEY ?? '';
}

async function captureActiveTab(): Promise<PageSnapshot> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error('No active tab.');
  }

  try {
    const response = (await browser.tabs.sendMessage(tab.id, {
      type: 'capture',
    })) as CaptureResponse | undefined;
    if (response?.type === 'snapshot') return response.snapshot;
  } catch {
    // Restricted pages (chrome://, Web Store) have no content script.
  }

  return snapshotFromPage({
    url: tab.url ?? '',
    title: tab.title ?? '',
    visibleText: '',
    selection: '',
  });
}

export default defineBackground(() => {
  void browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== 'ask') return;

    port.onMessage.addListener(async (message: PanelToBackground) => {
      if (message.type !== 'ask') return;

      const key = apiKey();
      if (!key) {
        const error: BackgroundToPanel = {
          type: 'error',
          message:
            'Missing WXT_GAMALIEL_API_KEY. Add it to .env and rebuild the extension.',
        };
        port.postMessage(error);
        return;
      }

      try {
        const [tab] = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (isGamalielPageUrl(tab?.url)) {
          const error: BackgroundToPanel = {
            type: 'error',
            message: ON_GAMALIEL_PAGE_HINT,
          };
          port.postMessage(error);
          return;
        }

        const snapshot = await captureActiveTab();
        const prefs = await loadPreferences();
        const messages = buildChatMessages(snapshot, prefs.question);
        await streamGamalielAnswer({
          apiKey: key,
          messages,
          theology: prefs.theologySlug,
          profile: prefs.profileSlug,
          onDelta: (text) => {
            const delta: BackgroundToPanel = { type: 'delta', text };
            port.postMessage(delta);
          },
        });
        const done: BackgroundToPanel = { type: 'done' };
        port.postMessage(done);
      } catch (err) {
        const error: BackgroundToPanel = {
          type: 'error',
          message: err instanceof Error ? err.message : 'Ask failed.',
        };
        port.postMessage(error);
      }
    });
  });
});
