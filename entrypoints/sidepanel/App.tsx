import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import {
  fetchProfiles,
  fetchTheologies,
  type ProfileOption,
  type TheologyOption,
} from '@/lib/catalog.ts';
import type { BackgroundToPanel } from '@/lib/messages.ts';
import {
  GAMALIEL_TAB_NAME,
  encouragementForLoad,
  isGamalielPageUrl,
  nextEncouragementCycle,
  type EncouragementCycle,
} from '@/lib/gamaliel-tab.ts';
import { openInSharedGamalielTab } from '@/lib/open-gamaliel-tab.ts';
import {
  FALLBACK_PREFERENCES,
  loadPreferences,
  resolvePreferences,
  savePreferences,
  type Preferences,
} from '@/lib/preferences.ts';
import { DEFAULT_QUESTION } from '@/lib/prompt.ts';
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
  const [screen, setScreen] = useState<'ask' | 'settings'>('ask');
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [onGamaliel, setOnGamaliel] = useState(false);
  const [encouragement, setEncouragement] = useState<EncouragementCycle>({
    index: 0,
  });

  useEffect(() => {
    let cancelled = false;
    void loadPreferences().then((prefs) => {
      if (!cancelled) setQuestion(prefs.question);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refreshActiveTab() {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (cancelled) return;
      const on = isGamalielPageUrl(tab?.url);
      setOnGamaliel(on);
      if (on) {
        setEncouragement((prev) => nextEncouragementCycle(prev, tab?.url));
      }
    }

    void refreshActiveTab();
    const onActivated = () => {
      void refreshActiveTab();
    };
    const onUpdated = (
      _tabId: number,
      changeInfo: { url?: string },
      tab: { active?: boolean },
    ) => {
      if (changeInfo.url && tab.active) void refreshActiveTab();
    };
    browser.tabs.onActivated.addListener(onActivated);
    browser.tabs.onUpdated.addListener(onUpdated);
    return () => {
      cancelled = true;
      browser.tabs.onActivated.removeListener(onActivated);
      browser.tabs.onUpdated.removeListener(onUpdated);
    };
  }, []);

  async function persistQuestion(next: string) {
    const resolved = next.trim() ? next : DEFAULT_QUESTION;
    setQuestion(resolved);
    const stored = await loadPreferences();
    await savePreferences({ ...stored, question: resolved });
  }

  function onAsk() {
    if (onGamaliel) return;
    void persistQuestion(question);
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
      <header className="top">
        <h1>{screen === 'settings' ? 'Settings' : 'Gamaliel'}</h1>
        <button
          type="button"
          className="text-btn"
          onClick={() => {
            if (screen === 'ask') void persistQuestion(question);
            setScreen(screen === 'settings' ? 'ask' : 'settings');
          }}
        >
          {screen === 'settings' ? 'Done' : 'Settings'}
        </button>
      </header>
      {screen === 'settings' ? (
        <SettingsPanel />
      ) : (
        <>
          {onGamaliel ? (
            <p className="hint">{encouragementForLoad(encouragement.index)}</p>
          ) : (
            <>
              <label className="question-field">
                <span className="visually-hidden">Question</span>
                <textarea
                  className="question"
                  rows={4}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onBlur={() => void persistQuestion(question)}
                  onKeyDown={(event) => {
                    if (
                      event.key !== 'Enter' ||
                      event.shiftKey ||
                      event.nativeEvent.isComposing ||
                      busy
                    ) {
                      return;
                    }
                    event.preventDefault();
                    onAsk();
                  }}
                />
              </label>
              <div className="ask-row">
                {question !== DEFAULT_QUESTION ? (
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => void persistQuestion(DEFAULT_QUESTION)}
                  >
                    Reset Question
                  </button>
                ) : null}
                <button type="button" onClick={onAsk} disabled={busy}>
                  {busy ? 'Listening…' : 'Ask Gamaliel'}
                </button>
              </div>
            </>
          )}
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
            !busy &&
            !onGamaliel && (
              <p className="empty">
                This extension does not track browsing activity or associate
                it with you or this computer. Every question and answer is
                anonymous.
              </p>
            )
          )}
        </>
      )}
    </div>
  );
}

function SettingsPanel() {
  const [prefs, setPrefs] = useState<Preferences>(FALLBACK_PREFERENCES);
  const [theologies, setTheologies] = useState<TheologyOption[]>([]);
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [stored, theologyRows, profileRows] = await Promise.all([
          loadPreferences(),
          fetchTheologies(),
          fetchProfiles(),
        ]);
        if (cancelled) return;
        const next = resolvePreferences(stored, {
          theologies: theologyRows,
          profiles: profileRows,
        });
        setTheologies(theologyRows);
        setProfiles(profileRows);
        setPrefs(next);
        if (
          next.theologySlug !== stored.theologySlug ||
          next.profileSlug !== stored.profileSlug
        ) {
          await savePreferences(next);
        }
      } catch {
        if (!cancelled) {
          setLoadError('Could not load options. Check your connection and try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function update(partial: Partial<Preferences>) {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    await savePreferences(next);
  }

  const theology = theologies.find((row) => row.slug === prefs.theologySlug);
  const profile = profiles.find((row) => row.slug === prefs.profileSlug);

  return (
    <section className="settings">
      {loading ? <p className="empty">Loading options…</p> : null}
      {loadError ? <p className="error">{loadError}</p> : null}
      {!loading && !loadError ? (
        <>
          <label className="field">
            <span>Theology</span>
            <select
              value={prefs.theologySlug}
              onChange={(event) => void update({ theologySlug: event.target.value })}
            >
              {theologies.map((row) => (
                <option key={row.slug} value={row.slug}>
                  {row.name}
                </option>
              ))}
            </select>
          </label>
          {theology?.description ? (
            <p className="hint">{theology.description}</p>
          ) : null}

          <label className="field">
            <span>Profile</span>
            <select
              value={prefs.profileSlug}
              onChange={(event) => void update({ profileSlug: event.target.value })}
            >
              {profiles.map((row) => (
                <option key={row.slug} value={row.slug}>
                  {row.name}
                </option>
              ))}
            </select>
          </label>
          {profile?.description ? <p className="hint">{profile.description}</p> : null}
        </>
      ) : null}
    </section>
  );
}
