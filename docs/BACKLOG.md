# Backlog

Engineering work catalog — **tickets** (`G-NNNN`). Rules: [`README.md`](README.md) § Backlog. Specs in [`backlog/`](backlog/); closed → [`backlog/archive/`](backlog/archive/).

<!-- NEXT_ID: 8 -->
**Next id:** **G-0008**. Allocate from this anchor, then increment it **and** the `NEXT_ID` HTML comment in the same change. Do not fill gaps. Never infer the next id from the filesystem.

> **Agent rule — ALWAYS read this file before allocating an id.** Canonical next id is **`NEXT_ID` / the “Next id” line above**.

---

## Active

> Order ≈ dependency priority (working set in [`../focus.md`](../focus.md)).

#### [G-0001](backlog/G-0001-hello-world.md): Hello World — side panel streams a Gamaliel answer

**In progress — built, awaiting localhost dogfood.** Toolbar opens the side panel; Ask captures page + selection, streams chat, renders markdown with scripture links.

#### [G-0002](backlog/G-0002-hosted-api-no-client-key.md): Call the public API with no client API key

**In progress.** Hosted chat (no baked key); [web#227](https://github.com/gamaliel-ai/gamaliel-web/issues/227) unblocked. [web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228) still blocks calling the zip *shippable*.

#### [G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md): Publish on the Chrome Web Store

**Blocked on org CWS account** ([publisher-store-accounts.md](publisher-store-accounts.md); Matt Shandra). Zip + unlisted listing only. Handshake / homepage: [G-0007](backlog/G-0007-site-install-cta-and-handshake.md). [G-0006](backlog/archive/G-0006-cws-review-risk.md) checklist is done.

## Deferred

#### [G-0007](backlog/G-0007-site-install-cta-and-handshake.md): Homepage install CTA and extension presence handshake

**Deferred.** Advertise on gamaliel.ai after a store URL exists. Chrome handshake + [web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229). Split from [G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md).

#### [G-0004](backlog/G-0004-viewport-screenshot-to-multimodal.md): Send what the user is looking at as a picture, not only text

**Deferred.** Viewport screenshot + multimodal chat part; do not fetch social CDN URLs. After G-0001 dogfood; needs API image parts.

## Recently closed

#### [G-0006](backlog/archive/G-0006-cws-review-risk.md): Minimize Chrome Web Store rejection and takedown risk

Shipped 2026-08-27 — Pre-submit CWS checklist done.

#### [G-0003](backlog/archive/G-0003-disable-ask-on-gamaliel.md): Hide Ask when the active tab is Gamaliel

Shipped 2026-08-23 — Ask hidden on gamaliel.ai; last answer stays.

## Will not do

- New Gamaliel API (`/v1/scripture/suggest` or similar) for this prototype — use the existing chat completions endpoint.
- Firefox / Edge stores or a custom `.crx` download page for v1 distribution — Chrome Web Store ([G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md)) + homepage CTA later ([G-0007](backlog/G-0007-site-install-cta-and-handshake.md)).
