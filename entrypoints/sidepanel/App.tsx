import { useState } from 'react';
import Markdown from 'react-markdown';
import type { BackgroundToPanel } from '@/lib/messages.ts';
import { GAMALIEL_TAB_NAME } from '@/lib/gamaliel-tab.ts';
import { openInSharedGamalielTab } from '@/lib/open-gamaliel-tab.ts';
import { absolutizeGamalielLinks, toGamalielHref } from '@/lib/scripture-links.ts';

function askGamaliel(onMessage: (msg: BackgroundToPanel) => void): void {
  const port = browser.runtime.connect({ name: 'ask' });
  port.onMessage.addListener((msg: BackgroundToPanel) => {
    onMessage(msg);
    if (msg.type === 'done' || msg.type === 'error') {
      port.disconnect();
    }
  });
  port.postMessage({ type: 'ask' });
}

export default function App() {
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onAsk() {
    setBusy(true);
    setError(null);
    setMarkdown('');
    askGamaliel((msg) => {
      if (msg.type === 'delta') {
        setMarkdown((prev) => prev + msg.text);
      } else if (msg.type === 'error') {
        setError(msg.message);
        setBusy(false);
      } else if (msg.type === 'done') {
        setBusy(false);
      }
    });
  }

  return (
    <div className="panel">
      <header>
        <h1>Gamaliel</h1>
        <p className="lede">
          What biblical truths can best explain what I am seeing here? What does
          the Bible say I should do in response?
        </p>
        <button type="button" onClick={onAsk} disabled={busy}>
          {busy ? 'Listening…' : 'Ask Gamaliel'}
        </button>
      </header>
      {error ? <p className="error">{error}</p> : null}
      {markdown ? (
        <article className="answer">
          <Markdown
            components={{
              a({ href, children }) {
                const url = toGamalielHref(href ?? '');
                return (
                  <a
                    href={url}
                    target={GAMALIEL_TAB_NAME}
                    rel="noreferrer"
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey ||
                        event.button !== 0
                      ) {
                        return;
                      }
                      event.preventDefault();
                      void openInSharedGamalielTab(url);
                    }}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {absolutizeGamalielLinks(markdown)}
          </Markdown>
        </article>
      ) : (
        !busy && (
          <p className="empty">
            Open a page, optionally highlight text, then ask. Nothing runs until
            you click.
          </p>
        )
      )}
    </div>
  );
}
