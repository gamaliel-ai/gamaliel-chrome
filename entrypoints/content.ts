import { snapshotFromPage } from '@/lib/capture.ts';
import type { CaptureRequest, CaptureResponse } from '@/lib/messages.ts';

export default defineContentScript({
  matches: ['https://*/*', 'http://*/*'],
  main() {
    browser.runtime.onMessage.addListener(
      (message: CaptureRequest, _sender, sendResponse) => {
        if (message.type !== 'capture') return;
        const snapshot = snapshotFromPage({
          url: location.href,
          title: document.title,
          visibleText: document.body?.innerText ?? '',
          selection: window.getSelection()?.toString() ?? '',
        });
        const response: CaptureResponse = { type: 'snapshot', snapshot };
        sendResponse(response);
      },
    );
  },
});
