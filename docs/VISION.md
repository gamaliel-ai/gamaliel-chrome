# Vision

Redirect attention from social media toward Scripture — so the reader can **renew the mind in Christ Jesus** (Romans 12:2) instead of staying in a worldly or unhealthy feed.

This extension is an **exit ramp for the reader**, not a public dunk on other people’s posts. Capture what is on the page, show a few relevant passages, and move into the Word.

The full product (including iOS screenshot share) is documented in `gamaliel-web` as [`docs/social-to-scripture-product-concept.md`](https://github.com/gamaliel-ai/gamaliel-web/blob/main/docs/social-to-scripture-product-concept.md). This file is the extension-shaped cut.

---

## Intent

When the user selects a post or highlighted text, suggest a small set of **Bible verses or short passages** that help them **turn toward God**, not merely match the topic of the post.

| Naive “search this tweet” | What we want |
| --- | --- |
| Outrage → “justice / enemies / kings” | Humility, slow to anger, bless those who persecute |
| Luxury / envy → “wealth / gold” | Contentment, treasure in heaven |
| Doomscroll / anxiety → keyword fragments | Peace, trust, not conformed to this age |
| Sexual / worldly → more of the same topic | Flee, purity, a renewed mind |

Raw semantic search matches **topic**. The product is **formative**: interpret the post’s spiritual posture, then find Scripture that helps the reader turn.

Tone: encouragement and redirection for the person using the extension — not condemnation of the author of the post.

---

## This repo

**Chrome first** (Manifest V3). Safari desktop may share this WXT codebase later. Chrome on iOS does not run extensions.

This is a sibling of `gamaliel-web`: host adapters, selection, and UI live here. Scripture ranking and prompts live in the Gamaliel API. Do not bake “Twitter” or “Instagram” into the API — only into content-script adapters.

**Not this repo:** iOS Share (screenshot → Gamaliel app) lives in `gamaliel-ios-macos`. Same API, different capture.

---

## How it should feel

- **Trigger:** context menu or post badge (“Find Scripture”). Chrome **Side Panel** is the reading surface.
- **Do not** auto-run on every tweet — cost, rate limits, and “the Bible is judging my feed.”
- Show **3–5 cards**: reference, short snippet, one-line *why*. Do not dump full chapters in the panel.
- Link **Open in Gamaliel** for reading more.
- Privacy: we use the selected text to find Scripture; we do not post back to the network.

---

## Talking to the API

**v0 (no API change):** selected text → optional theme rewrite → `POST /v1/scripture/search` (public, chapter-level `text` + `similarity`). Query phrasing matters; do not send a raw tweet as `q`. Default translation: `eng-web` (licensing-safe).

Search has no system prompt. Embeddings cannot “renew the mind.” A later **`POST /v1/scripture/suggest`** in `gamaliel-web` (intent `renew_mind`, verse pin, optional `why`) is the shared brain for this extension and iOS Share. Until then, compose a rewrite + search.

Confirm `chrome-extension://` origins against API CORS before relying on the public search endpoint from the extension.

---

## Quality bar

Without a rewrite/pin step, results feel like a random adjacent chapter. Offline check: real posts → short theme query → search → “would this renew my mind?”

Default intent is **renew the mind**. A later option can be topical (“what does the Bible say about this?”).

---

## Sequence (extension)

1. **First prototype:** [G-0001](backlog/G-0001-hello-world.md) — toolbar opens the side panel; custom system + page/selection user prompt; stream `POST /v1/chat/completions`; render markdown; scripture links to Gamaliel. Quality is in the prompt, not a new API.
2. More hosts / tighter capture; context menu or post badge into the same panel.
3. Optional later: `/v1/scripture/search` or `/v1/scripture/suggest` if chat-only is not enough.
4. Optional: Safari desktop from this same project.

---

## Last updated

August 2026 — adapted from `gamaliel-web` `docs/social-to-scripture-product-concept.md`.
