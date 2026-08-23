# G-0005: Publish on the Chrome Web Store and enable the site install CTA

**Status:** Deferred — after a releasable build ([G-0002](G-0002-hosted-api-no-client-key.md)); listing work can start in parallel once copy/assets exist  
**Type:** chore  
**Priority:** P2 — required for anyone who is not loading unpacked  
**Created:** 2026-08-23

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Consumer install | **Chrome Web Store only.** No sideload, no `.crx` download, no inline install (`chrome.webstore.install` is dead). |
| Site CTA | Button on gamaliel.ai opens the **store listing in a new tab**. Reuse the existing homepage CTA *section*; do not invent a new surface. Website cut: **[gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229)**. |
| Who sees the CTA | **Desktop Chrome** (and maybe Chromium Edge — decide on the web ticket). Hide on mobile, iOS, Safari, Firefox. Chrome on iOS does not run extensions. |
| Already installed | Hide or swap the CTA. Requires a **presence handshake** from this extension on `gamaliel.ai` / `www.gamaliel.ai`. |
| Visibility | Submit **unlisted** first (same review bar). Flip to public when the homepage href is ready. Keep one stable store URL. |
| Featuring | Do **not** plan on Chrome Web Store editorial featuring. Written policy excludes religious/political products from featuring. Distribution is the homepage. |
| Other stores | **Will not do** for v1: Firefox, Edge Add-ons, custom download page. |

## Problem / goal

Everyone who visits Gamaliel on Chrome should be encouraged to install the extension. That only works if (1) a store listing exists and (2) the site can point at it and stop nagging people who already installed.

This ticket is the **chrome-repo** cut: package, listing, review, handshake. The homepage button lives in `gamaliel-web`.

## Depends on

- **[G-0002](G-0002-hosted-api-no-client-key.md)** — no baked provider key in the zip. Blocks a *public* (or even unlisted-to-friends) package.
- **[G-0001](G-0001-hello-world.md)** dogfood — listing screenshots need a working panel.
- **[G-0006](G-0006-cws-review-risk.md)** — listing tone, permission justifications, privacy URL, pre-submit eval. Do that checklist before clicking Submit.
- **gamaliel-web:** privacy policy page that covers “page/selection text → our API → Scripture” if one does not already.
- **[gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229)** — homepage CTA targeting + analytics.

## Direction

### Store (this repo + Google)

- One-time Chrome Web Store developer registration.
- `npm run zip` → upload. Account/listing can stay while the GitHub repo is private.
- Listing: name **Gamaliel**, short + long description as a **personal Scripture companion while browsing social** (see [G-0006](G-0006-cws-review-risk.md)). 128px icon (already in the manifest), side-panel screenshots on a social page — **not** culture-war examples.
- Privacy policy URL (live, HTTP 200).
- Dashboard: single-purpose sentence; justify each permission (`sidePanel`, `storage`, `tabs`, host access). Prefer narrowing `https://*/*` / `http://*/*` if Ask only needs the active tab (`activeTab` or equivalent) — [G-0006](G-0006-cws-review-risk.md).
- After first approval: version bumps are a new zip + review. Optional later: WXT `publish-browser-extension` in CI (out of scope unless it is cheap).

### Handshake (this repo)

The page cannot see extensions unless we expose a signal on `gamaliel.ai` / `www.gamaliel.ai` (same host cut as [G-0003](archive/G-0003-disable-ask-on-gamaliel.md)):

- `externally_connectable` + `runtime` ping, **or** a tiny content script that sets a data attribute / custom event.
- Site waits briefly; if present, do not show install CTA.

Inverse of G-0003 (panel hides Ask *on* Gamaliel; site hides install *when* the extension is there).

### First-run (optional in this ticket if small)

Short panel hint: pin the toolbar icon, go to a social tab, Ask. Many people return from the Store and think nothing happened.

## Out of scope

- Homepage React/copy (web issue)
- Safari / Firefox packaging
- Auto-run on social pages
- Changing Ask / prompt theology

## Done when

- Unlisted listing is approved; URL is stable.
- A production-shaped zip (no client API key) is what reviewers get.
- `gamaliel.ai` can detect install via the handshake.
- Public flip is a listing toggle, not a new ID.
- Web CTA can ship against that URL (web issue Done when).

## Links

- [G-0002](G-0002-hosted-api-no-client-key.md) — ship blocker
- [G-0006](G-0006-cws-review-risk.md) — rejection-risk checklist
- [VISION.md](../VISION.md) — Chrome first; not an iOS extension
- Existing site analog: `IOSSafariAppStoreBanner` in gamaliel-web (store hop + dismiss)
- [gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229) — homepage CTA
