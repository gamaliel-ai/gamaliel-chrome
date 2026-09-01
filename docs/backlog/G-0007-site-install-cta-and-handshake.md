# G-0007: Homepage install CTA and extension presence handshake

**Status:** Deferred — after a stable Chrome Web Store URL ([G-0005](G-0005-chrome-web-store-and-site-cta.md))  
**Type:** improvement  
**Priority:** P2 — distribution on gamaliel.ai; not required to submit the listing  
**Created:** 2026-08-27

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Split from [G-0005](G-0005-chrome-web-store-and-site-cta.md) | Store packaging/publish stays on G-0005. This ticket is **advertise on gamaliel.ai**. |
| Site CTA | Button on gamaliel.ai opens the **store listing in a new tab**. Reuse the existing homepage CTA *section*. Website cut: **[gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229)**. |
| Who sees the CTA | **Desktop Chrome** (Chromium Edge: decide on the web ticket). Hide on mobile, iOS, Safari, Firefox. |
| Already installed | Hide or swap the CTA. Requires a **presence handshake** from this extension on `gamaliel.ai` / `www.gamaliel.ai` (same host cut as [G-0003](archive/G-0003-disable-ask-on-gamaliel.md)). |
| Handshake mechanism | TBD at interview — `externally_connectable` ping **or** content-script marker. |

## Problem / goal

People on desktop Chrome should be invited to install from the homepage, and people who already installed should not keep seeing that invite. The page cannot see the extension unless this repo exposes a signal.

## Depends on

- **[G-0005](G-0005-chrome-web-store-and-site-cta.md)** — unlisted listing URL to point at.
- **[gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229)** — homepage button, targeting, analytics.

## Out of scope

- Chrome Web Store zip, listing, review ([G-0005](G-0005-chrome-web-store-and-site-cta.md))
- Changing Ask / capture

## Done when

- Extension exposes a documented presence signal on `gamaliel.ai` / `www.gamaliel.ai`.
- Site can hide or swap the install CTA when that signal is present (web ticket).

## Links

- [G-0005](G-0005-chrome-web-store-and-site-cta.md) — store listing
- [`../chrome-web-store.md`](../chrome-web-store.md) §9
- [gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229)
