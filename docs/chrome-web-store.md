# Publish on the Chrome Web Store

Step-by-step for the first listing and later version bumps. Locked product choices live in [G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md) and [G-0006](backlog/G-0006-cws-review-risk.md) — this file is the procedure, not a second tracker.

**v1 distribution:** Chrome Web Store only. No sideload page, no `.crx` download, no inline install. Firefox / Edge stores are [will not do](BACKLOG.md). Distribution after approval is the [gamaliel.ai](https://gamaliel.ai) homepage CTA ([gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229)), not Chrome Web Store featuring ([VISION.md](VISION.md): Chrome first; Chrome on iOS does not run extensions).

Google’s own overview: [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish). Review: [CWS review process](https://developer.chrome.com/docs/webstore/review-process).

---

## Sequence

Do these in order. Listing copy and the privacy URL can be drafted in parallel with [G-0002](backlog/G-0002-hosted-api-no-client-key.md); do **not** upload a zip until the zip is releasable.

| Step | Where | Done when |
| ---- | ----- | --------- |
| 1 | This repo + `gamaliel-web` | Production-shaped zip has **no** client API key |
| 2 | This repo | [G-0006](backlog/G-0006-cws-review-risk.md) checklist complete on the build you will upload |
| 3 | `gamaliel-web` | Privacy policy live and accurate for the extension |
| 4 | Google | Developer account registered |
| 5 | This repo + design | Listing assets ready |
| 6 | This repo | `npm run zip` |
| 7 | CWS dashboard | Item created, **unlisted**, package + listing filled |
| 8 | CWS dashboard | Submitted; item ID / URL stable |
| 9 | This repo + `gamaliel-web` | Install handshake + homepage CTA against that URL |
| 10 | CWS dashboard | Flip **public** when the site href is ready (same item, not a new ID) |

After first approval, skip to [Later releases](#later-releases).

---

### 1. Ship a releasable zip (no baked key)

[G-0002](backlog/G-0002-hosted-api-no-client-key.md) blocks any package that leaves this machine.

- Hosted (no BYOK) `POST /v1/chat/completions`: [gamaliel-web#227](https://github.com/gamaliel-ai/gamaliel-web/issues/227). API shape: [`../gamaliel-web/docs/public-api.md`](../../gamaliel-web/docs/public-api.md) and [`../gamaliel-web/gamaliel-api/docs/endpoints/chat-completions.md`](../../gamaliel-web/gamaliel-api/docs/endpoints/chat-completions.md).
- Preflight treating **intent**, not cited page text: [gamaliel-web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228). Needed so a normal social feed is not a `400 content_filter` in review or in the wild. Does not block the G-0002 code change; **does** block calling the zip shippable.
- Confirm Ask streams against hosted mode with an empty/omitted key. Grep the zip / `dist/` for secrets before upload.

Dogfood of the panel ([G-0001](backlog/G-0001-hello-world.md)) should already have happened so screenshots are of a working product.

---

### 2. Run the rejection-risk checklist

Complete [G-0006](backlog/G-0006-cws-review-risk.md) on **this** build. Attach notes to the G-0005 submission (dashboard “what’s new” or an internal note — do not invent a second tracker).

In short:

1. Permissions match code. Justify `sidePanel`, `storage`, `tabs` in the dashboard. Narrow `https://*/*` / `http://*/*` in `wxt.config.ts` if Ask only needs the active tab — broad host access is the common technical reject.
2. Privacy policy URL (step 3) returns HTTP 200.
3. No secrets in the zip (step 1).
4. Listing: personal Scripture companion while on social; Christianity visible; no culture-war keywords or screenshots ([VISION.md](VISION.md) purpose: reader formation, not a dunk on the post’s author).
5. Single-purpose sentence in the dashboard.
6. Hot-button eval: contested posts → answers as a hostile reviewer would read them. Fix contempt / “group is a threat,” not merely biblical content.
7. Submit **unlisted** first (step 7).
8. User-initiated Ask only; no auto-run (already locked in vision).

Written CWS rules cited from G-0006: [hate speech](https://developer.chrome.com/docs/webstore/program-policies/hate-and-violence), [quality / single purpose](https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines), [privacy justifications](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).

---

### 3. Privacy policy URL

CWS requires a **live HTTPS** privacy policy. Existing site page: [https://gamaliel.ai/site/privacy-policy](https://gamaliel.ai/site/privacy-policy), source [`../gamaliel-web/client/public/web-content/privacy-policy.md`](../../gamaliel-web/client/public/web-content/privacy-policy.md).

Before submit, that page must cover the extension (G-0005 / G-0006): page or selection text is sent to Gamaliel to return Scripture; it is not sold; it is not posted back to the social network. If the current policy only describes the web/iOS apps, extend it in `gamaliel-web` and deploy **before** you paste the URL in the dashboard.

---

### 4. One-time Chrome Web Store developer registration

1. Sign in with the Google account that will own the listing: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Pay the one-time registration fee.
3. The GitHub repo can stay private. Reviewers only see the zip and listing fields.

---

### 5. Listing assets and copy

Prepare before creating the item so you are not blocked in the dashboard:

| Asset | Notes |
| ----- | ----- |
| Name | **Gamaliel** (already in `wxt.config.ts`) |
| Short + long description | Personal Scripture companion while browsing social. Do not hide Christianity. Do not sell conversion therapy or “oppose a protected class.” |
| 128×128 icon | Already in the manifest / `public` icons |
| Screenshots | 1280×800 or 640×400. Side panel on an ordinary social page after [G-0001](backlog/G-0001-hello-world.md) dogfood — **not** culture-war examples |
| Privacy policy URL | Step 3 |
| Single-purpose | e.g. “When you ask, suggest Scripture that helps renew your mind based on the current page or selection.” |

Do **not** plan on editorial featuring. Written CWS policy excludes religious/political products from featuring; the homepage is the distribution channel.

---

### 6. Build the store zip

From this repo (Node 22, see [`../README.md`](../README.md)):

```bash
nvm use
npm run zip
```

Upload the zip WXT writes under `dist/`, not the unpacked `dist/chrome-mv3` folder and not a self-packed `.crx`.

Bump the extension version on every upload. CWS rejects a repeat of a version it has already seen.

---

### 7. Create the item — unlisted first

In the developer dashboard: **New item** → upload the zip.

Fill store listing, category, language, and the [privacy questionnaire](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy) honestly: this extension reads page/selection text and sends it to `https://api.gamaliel.ai`. Justify every permission and host permission.

**Visibility: Unlisted.** Same review bar as public, smaller blast radius ([G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md)). You get a stable item ID and listing URL — keep that ID forever. Public vs unlisted is a toggle, not a new listing.

---

### 8. Submit and wait

Submit for review. Timeline is days, sometimes longer.

If rejected, the dashboard mail usually cites permissions, privacy URL, or single-purpose mismatch — the technical path in G-0006, not “this app contains Romans.” Fix, bump version, `npm run zip`, resubmit.

When **unlisted** is approved, the URL works for anyone who has the link. That URL is what the homepage CTA should use. Record it on [G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md) / [gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229).

---

### 9. Site CTA and install handshake

Chrome-repo cut is still G-0005. Website cut is [gamaliel-web#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229).

- **CTA:** Reuse the existing homepage CTA *section*. Button opens the **store listing in a new tab**. Show on **desktop Chrome** (maybe Chromium Edge — decide on the web ticket). Hide on mobile, iOS, Safari, Firefox. Analog: [`../gamaliel-web/client/src/components/shared/IOSSafariAppStoreBanner.tsx`](../../gamaliel-web/client/src/components/shared/IOSSafariAppStoreBanner.tsx) (store hop + dismiss).
- **Already installed:** Hide or swap the CTA. The page cannot see the extension unless this repo exposes a signal on `gamaliel.ai` / `www.gamaliel.ai` (`externally_connectable` + `runtime` ping, **or** a tiny content script). Same host cut as [G-0003](backlog/archive/G-0003-disable-ask-on-gamaliel.md) (panel hides Ask *on* Gamaliel; site hides install *when* the extension is there).
- **First-run (optional if small):** Short panel hint — pin the toolbar icon, go to a social tab, Ask. Many people return from the Store and think nothing happened.

Web CTA can ship against the unlisted URL; flipping public is step 10.

---

### 10. Flip public

When the homepage href is live and you want discovery beyond the link: dashboard visibility → **Public**. Same item ID. Do not create a second listing.

---

## Later releases

1. Bump version.
2. `nvm use && npm run zip`.
3. Upload a new package in the same dashboard item.
4. Fill “What’s new.”
5. Submit (review again).

Optional later: WXT `publish-browser-extension` in CI — out of scope until it is cheap ([G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md)).

---

## Out of scope (v1)

Same as G-0005 / BACKLOG will-not-do: Safari / Firefox packaging, Edge Add-ons, custom download page, auto-run on social pages, changing Ask / prompt theology for review.

---

## Links

| This repo | |
| --------- | - |
| [G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md) | Ticket: listing + handshake |
| [G-0006](backlog/G-0006-cws-review-risk.md) | Pre-submit checklist |
| [G-0002](backlog/G-0002-hosted-api-no-client-key.md) | No client key in the zip |
| [G-0001](backlog/G-0001-hello-world.md) | Working panel for screenshots |
| [G-0003](backlog/archive/G-0003-disable-ask-on-gamaliel.md) | Inverse of site handshake hosts |
| [VISION.md](VISION.md) | Product purpose and Chrome-first |
| [`../README.md`](../README.md) | `npm run zip` |

| `gamaliel-web` | |
| -------------- | - |
| [#227](https://github.com/gamaliel-ai/gamaliel-web/issues/227) | Hosted chat completions |
| [#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228) | Preflight vs foul page text |
| [#229](https://github.com/gamaliel-ai/gamaliel-web/issues/229) | Homepage install CTA |
| [privacy-policy.md](../../gamaliel-web/client/public/web-content/privacy-policy.md) | Policy source |
| [public-api.md](../../gamaliel-web/docs/public-api.md) | API the zip calls |
