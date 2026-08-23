import { snapshotFromPage, visibleTextFromBlocks, type PageTextBlock } from '@/lib/capture.ts';
import type { CaptureRequest, CaptureResponse } from '@/lib/messages.ts';

function textBlocksInDocument(): PageTextBlock[] {
  if (!document.body) return [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const blocks: PageTextBlock[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent ?? '';
    if (!text.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    blocks.push({
      text,
      box: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left },
    });
  }
  return blocks;
}

export default defineContentScript({
  matches: ['https://*/*', 'http://*/*'],
  main() {
    browser.runtime.onMessage.addListener(
      (message: CaptureRequest, _sender, sendResponse) => {
        if (message.type !== 'capture') return;
        const snapshot = snapshotFromPage({
          url: location.href,
          title: document.title,
          visibleText: visibleTextFromBlocks(textBlocksInDocument(), {
            width: window.innerWidth,
            height: window.innerHeight,
          }),
          selection: window.getSelection()?.toString() ?? '',
        });
        const response: CaptureResponse = { type: 'snapshot', snapshot };
        sendResponse(response);
      },
    );
  },
});
