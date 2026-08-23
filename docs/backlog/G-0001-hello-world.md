# G-0001: Hello World — side panel streams a Gamaliel answer

**Status:** In progress  
**Type:** improvement  
**Priority:** P1 — first prototype  
**Created:** 2026-08-23

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Auth | Build-time `WXT_GAMALIEL_API_KEY` in `.env`. Securing the key is later. |
| API | `POST https://api.gamaliel.ai/v1/chat/completions` via official `openai` SDK (`stream: true`). Background SW makes the call (key not in the page). |
| Scripture hrefs | API emits `/read/MAT/5?verse=…`; rewrite to `https://gamaliel.ai/read/…`, open in a new tab. |
| Toolbar | No popup. `sidePanel.setPanelBehavior({ openPanelOnActionClick: true })`. |

## Problem / goal

Ship a dogfoodable Chrome side panel: click the toolbar icon, capture what the user is looking at, and stream a **normal Gamaliel answer** (markdown + scripture links) from the existing public chat API. Quality lives in the **prompt**, not in a new ranking endpoint.

This is the first implementable cut. Later polish (settings, host badges, tab-vs-window for links) can be follow-on tickets.

## Direction

### Surface

- Toolbar click **opens the Chrome side panel**. That is the only primary UI.
- Do **not** auto-query on open. One explicit action (e.g. “Ask Gamaliel”) starts the request.
- No settings UI in this ticket. Scripture link target (same tab vs new tab) is a later experiment; pick a simple default (new tab is fine).

### Capture (content script → panel)

Build a short **user prompt** from whatever we can see:

1. **Site** — hostname / a guessed product name (“I am on x.com / Twitter”).
2. **What I’m looking at** — visible page text the adapter can take (whole view is OK for Hello World; no per-post badge required).
3. **Selection** — if the user has highlighted text, include it as extra context (“I selected: …”).

The model decides what to do after reading that context. We do not run a separate theme-rewrite + `/v1/scripture/search` path in this ticket.

### Prompt

- **System:** custom instructions for this extension — formative, renew-the-mind, not dunking on the author; ask the model to think biblically about what the user is seeing and point them to the best Scripture to read in this circumstance.
- **User:** “Here is what I am looking at right now…” (site + page content + optional selection) + a redirect: help me think biblically; give the best Scripture for this circumstance.

Keep the composed strings in the extension (easy to iterate). Do not change Gamaliel API contracts.

### API

- Existing **`POST /v1/chat/completions`** (OpenAI-compatible, SSE). No new routes.
- Auth / CORS as the public API already requires — confirm `chrome-extension://` origin before relying on the browser calling the host directly; if CORS blocks, proxy from the extension background (still the same endpoint).
- Stream tokens into the panel as they arrive.

### Client libraries (`package.json`)

Add off-the-shelf deps — do not hand-roll SSE framing or a markdown parser:

- **SSE / OpenAI-compatible stream** — e.g. official `openai` client or a small SSE parser used with `fetch` (`eventsource-parser`, etc.). Pick one and use it.
- **Markdown render** — e.g. `react-markdown` (+ a sanitizing/rehype plugin if we render HTML).

Scripture references in the answer should be **links to Gamaliel** (same URL shape the web app uses for a reference). Default: `target=_blank` / new tab. Setting for “replace this tab” is out of scope.

### Hosts

Hello World does not need a polished X adapter. Capture should work on a normal https page (document title + selected text + a reasonable slice of visible text). Tighten host-specific adapters later.

## Out of scope

- `/v1/scripture/search` cards, `/v1/scripture/suggest`, API changes
- Context-menu / per-post badge (can reuse the same panel later)
- Settings / options page / translation picker
- Auto-run on navigation or every tweet
- Account UI (beyond whatever the public chat endpoint already needs)
- Safari

## Done when

- Clicking the extension icon opens the side panel.
- “Ask Gamaliel” (or equivalent) sends system + user prompts built from site + page text + selection (when present).
- The answer **streams** and **renders as markdown**.
- Scripture links in that markdown open Gamaliel.
- Streaming and markdown packages are declared in `package.json` and used (not a custom EventSource parser / markdown subset).

## Links

- [`VISION.md`](../VISION.md) — product tone and non-goals; this ticket **supersedes** the v0 “rewrite + `/v1/scripture/search`” sequence for the first prototype.
- [`gamaliel-web` public API](https://github.com/gamaliel-ai/gamaliel-web/blob/main/docs/public-api.md) — `POST /v1/chat/completions`
