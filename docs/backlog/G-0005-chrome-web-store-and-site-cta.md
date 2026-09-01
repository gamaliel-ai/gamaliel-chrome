# G-0005: Publish on the Chrome Web Store

**Status:** Blocked — org Chrome Web Store account (Matt Shandra); see [`../publisher-store-accounts.md`](../publisher-store-accounts.md)  
**Type:** chore  
**Priority:** P2 — required for anyone who is not loading unpacked  
**Created:** 2026-08-23

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Consumer install | **Chrome Web Store only.** No sideload, no `.crx` download, no inline install (`chrome.webstore.install` is dead). |
| This ticket | **Package and publish** the extension (zip, listing, unlisted submit). Procedure: [`../chrome-web-store.md`](../chrome-web-store.md). |
| Advertise on gamaliel.ai | **Out of scope.** Handshake + homepage CTA: **[G-0007](G-0007-site-install-cta-and-handshake.md)** / [gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229). |
| Visibility | Submit **unlisted** first (same review bar). Flip to public later (same item ID). Homepage href is G-0007. |
| Publisher identity | **Organization** (nonprofit Foundation), not a personal Google account. **Matt Shandra** sets up CWS (trader) and the same org pattern for iOS. Canonical: [`../publisher-store-accounts.md`](../publisher-store-accounts.md). |
| Featuring | Do **not** plan on Chrome Web Store editorial featuring. Written policy excludes religious/political products from featuring. |
| Other stores | **Will not do** for v1: Firefox, Edge Add-ons, custom download page. |

### Resolved (interview)

1. **2026-08-27** — Drop “advertise on gamaliel.ai” from this ticket. Focus on packaging and Chrome Web Store publish. Site CTA + presence handshake filed as [G-0007](G-0007-site-install-cta-and-handshake.md).
2. **2026-08-27** — CWS **trader vs non-trader** is a sticking point (same class of issue as iOS org vs personal Apple Developer). Nonprofit still publishes as **trader** / organization. Matt Shandra sets up the proper accounts; engineers do not submit under a personal ID. Doc: [`../publisher-store-accounts.md`](../publisher-store-accounts.md).

## Problem / goal

Anyone who is not loading unpacked `dist/chrome-mv3` needs an approved Chrome Web Store item (start **unlisted**) and a production-shaped zip with no client API key.

## Depends on

- **[G-0002](G-0002-hosted-api-no-client-key.md)** — no baked provider key in the zip.
- **[G-0001](G-0001-hello-world.md)** dogfood — listing screenshots need a working panel.
- **[G-0006](archive/G-0006-cws-review-risk.md)** — listing tone, permission justifications, privacy URL, pre-submit eval. **Done.**
- **gamaliel-web:** privacy policy page that covers “page/selection text → our API → Scripture” if one does not already.
- **Publisher accounts:** org Chrome Web Store (trader) + iOS Apple Developer — [publisher-store-accounts.md](../publisher-store-accounts.md). **Matt Shandra.** Blocks first CWS submit.
- **[gamaliel-web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228)** — preflight vs foul page text; blocks calling the zip *shippable* for review, not drafting listing copy.

## Direction

Follow [`../chrome-web-store.md`](../chrome-web-store.md) steps 1–8 and 10 (skip step 9 — that is [G-0007](G-0007-site-install-cta-and-handshake.md)).

- One-time Chrome Web Store developer registration **on the org account** ([publisher-store-accounts.md](../publisher-store-accounts.md)).
- `npm run zip` → upload. GitHub can stay private.
- Listing: name **Gamaliel**, personal Scripture companion while browsing social ([G-0006](archive/G-0006-cws-review-risk.md)). 128px icon already in the manifest. Screenshots: ordinary social page + side panel, **not** culture-war examples.
- Privacy policy URL (live, HTTP 200).
- Dashboard: single-purpose sentence; justify `sidePanel`, `storage`, `tabs`, host access.
- After first approval: version bumps are a new zip + review.

## Out of scope

- Homepage CTA, presence handshake, first-run “you just installed” UX — [G-0007](G-0007-site-install-cta-and-handshake.md)
- Safari / Firefox packaging
- Auto-run on social pages
- Changing Ask / prompt theology
- WXT `publish-browser-extension` in CI unless it is cheap

## Done when

- Unlisted listing is submitted (approval may still be pending review).
- Reviewers get a production-shaped zip with **no** client API key.
- Item ID / listing URL is stable (record it for [G-0007](G-0007-site-install-cta-and-handshake.md)).
- Public flip is a listing toggle, not a new ID (can happen after G-0007 if you want the homepage live first).

## Links

- [`../publisher-store-accounts.md`](../publisher-store-accounts.md) — org CWS + iOS identity (blocker)
- [`../chrome-web-store.md`](../chrome-web-store.md) — publish sequence
- [G-0007](G-0007-site-install-cta-and-handshake.md) — site advertise + handshake
- [G-0002](G-0002-hosted-api-no-client-key.md) — no client key in the zip
- [G-0006](archive/G-0006-cws-review-risk.md) — rejection-risk checklist
- [VISION.md](../VISION.md) — Chrome first; not an iOS extension
