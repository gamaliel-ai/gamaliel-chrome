# Backlog

Engineering work catalog — **tickets** (`G-NNNN`). Rules: [`README.md`](README.md) § Backlog. Specs in [`backlog/`](backlog/); closed → [`backlog/archive/`](backlog/archive/).

<!-- NEXT_ID: 7 -->
**Next id:** **G-0007**. Allocate from this anchor, then increment it **and** the `NEXT_ID` HTML comment in the same change. Do not fill gaps. Never infer the next id from the filesystem.

> **Agent rule — ALWAYS read this file before allocating an id.** Canonical next id is **`NEXT_ID` / the “Next id” line above**.

---

## Active

> Order ≈ dependency priority (working set in [`../focus.md`](../focus.md)).

#### [G-0001](backlog/G-0001-hello-world.md): Hello World — side panel streams a Gamaliel answer

**In progress — built, awaiting localhost dogfood.** Toolbar opens the side panel; Ask captures page + selection, streams chat, renders markdown with scripture links.

#### [G-0002](backlog/G-0002-hosted-api-no-client-key.md): Call the public API with no client API key

**Blocked on [gamaliel-web#227](https://github.com/gamaliel-ai/gamaliel-web/issues/227).** Remove baked `WXT_GAMALIEL_API_KEY`; use hosted chat completions. [web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228) (preflight vs foul page text) blocks *ship*, not the client diff.

## Deferred

#### [G-0004](backlog/G-0004-viewport-screenshot-to-multimodal.md): Send what the user is looking at as a picture, not only text

**Deferred.** Viewport screenshot + multimodal chat part; do not fetch social CDN URLs. After G-0001 dogfood; needs API image parts.

#### [G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md): Publish on the Chrome Web Store and enable the site install CTA

**Deferred.** Store listing (unlisted → public) + install handshake for gamaliel.ai. Procedure: [`chrome-web-store.md`](chrome-web-store.md). Homepage button: [gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229). Blocked on a releasable zip ([G-0002](backlog/G-0002-hosted-api-no-client-key.md)).

#### [G-0006](backlog/G-0006-cws-review-risk.md): Minimize Chrome Web Store rejection and takedown risk

**Deferred.** Pre-submit checklist for G-0005: permissions, privacy, listing tone, hot-button answer eval. Christianity stays visible; product purpose stays reader formation, not conversion therapy or class targeting.

## Recently closed

#### [G-0003](backlog/archive/G-0003-disable-ask-on-gamaliel.md): Hide Ask when the active tab is Gamaliel

Shipped 2026-08-23 — Ask hidden on gamaliel.ai; last answer stays.

## Will not do

- New Gamaliel API (`/v1/scripture/suggest` or similar) for this prototype — use the existing chat completions endpoint.
- Firefox / Edge stores or a custom `.crx` download page for v1 distribution — Chrome Web Store + homepage CTA only ([G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md)).
