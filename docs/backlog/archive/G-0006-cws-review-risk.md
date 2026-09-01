# G-0006: Minimize Chrome Web Store rejection and takedown risk

**Status:** Shipped 2026-08-27 — Pre-submit CWS checklist done (permissions, privacy, listing tone, hot-button eval).  
**Type:** chore  
**Priority:** P2 — same train as first store submit  
**Created:** 2026-08-23

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Christianity in the listing | **Do not hide it.** Mismatch between listing and product is itself a policy problem. Frame as Scripture for the *reader*, not a political campaign. |
| Product purpose | **Personal formation / exit ramp** ([VISION.md](../../VISION.md)). Not “oppose a protected class,” not conversion therapy, not public dunks on authors of posts. |
| Hot-button answers | Biblical answers on marriage, abortion, etc. are in scope. Tone stays **encouragement and redirection**, not “this group is a threat / should be hated.” |
| Store featuring | Will not happen (religious/political content is excluded from featuring). Not a reject. |
| Conversion-therapy framing | **Will not do** as a feature or selling point (“change your orientation,” ex-gay program). That is the category Google has publicly removed (Play analog: Living Hope, 2019). |
| Culture-war listing | No store keywords or screenshots built around LGBTQ, abortion, or partisan fights. |
| Other browsers | No Edge/Firefox stores in v1 ([G-0005](../G-0005-chrome-web-store-and-site-cta.md)). |

## Problem / goal

A reviewer or a later reporter could treat traditional sexual ethics or abortion answers as [hate speech](https://developer.chrome.com/docs/webstore/program-policies/hate-and-violence) (“advocating against” groups including sexual orientation / gender identity). Residual discretion is real.

Public evidence does **not** show a ban on Bible products: many verse/new-tab/YouVersion-adjacent extensions are live; YouVersion-scale Bible apps stay on Play with the full canon. Documented removals are products **whose job** is conversion therapy or incitement, not “this app contains Romans.”

The **more likely** first reject is technical: broad host permissions, unused APIs, missing privacy URL, single-purpose / description mismatch. Treat worldview risk as listing + live-answer tone, not as “look secular.”

## Depends on

- Run this checklist as part of [G-0005](../G-0005-chrome-web-store-and-site-cta.md) submit (procedure: [`../../chrome-web-store.md`](../../chrome-web-store.md) step 2). Does not block G-0001 dogfood.
- Prompt/API quality lives mainly in gamaliel-web; this ticket owns **what we ship in the zip and listing** and a **pre-submit answer eval**.

## Direction

### Written CWS rules to satisfy

- [Hate speech](https://developer.chrome.com/docs/webstore/program-policies/hate-and-violence): no advocating hatred or incitement toward protected groups; no extremist fundraising.
- [Quality / single purpose](https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines): one narrow purpose; no extra toolbars/ads.
- [Privacy justifications](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy): every permission explained; minimum access.
- Religious content: allowed; **not featured**.

### Pre-submit checklist

1. **Permissions** — Remove unused. Justify `sidePanel`, `storage`, `tabs`. Narrow `<all_urls>` / `https://*/*` if Ask only needs the active tab. Broad host access is the common *technical* reject and the scary install warning.
2. **Privacy policy** — Live URL; states page/selection text goes to Gamaliel to return Scripture; not sold; not posted back to the social network.
3. **No secrets in the zip** — [G-0002](../G-0002-hosted-api-no-client-key.md).
4. **Listing copy** — Personal Scripture companion while on social. Not culture-war. Screenshots: ordinary feed + panel, not hot-button posts.
5. **Single-purpose sentence** — e.g. “When you ask, suggest Scripture that helps renew your mind based on the current page or selection.”
6. **Hot-button eval** — Before submit, paste a few contested posts (same-sex marriage, abortion, etc.) and read answers as a hostile reviewer would. Fix prompt/product if output is contempt or “group is a threat,” not if it is simply biblical.
7. **Unlisted first** — [G-0005](../G-0005-chrome-web-store-and-site-cta.md). Same review, smaller blast radius.
8. **Behavior already locked in vision** — User-initiated Ask only; no auto-run; no public labeling of other people’s posts.

### After launch

Coordinated reports can still happen. Appeal path is the CWS developer email. Do not pre-write a stealth listing. Keep answers in the same formative register.

## Out of scope

- Softening or omitting Scripture to please a reviewer
- Changing theology/profile in the API except to keep the existing “reader, not dunk” bar
- Play Store / iOS review (other products)

## Done when

- Checklist above is completed and attached to the G-0005 submission notes (dashboard “what’s new” / internal doc — do not invent a second tracker).
- Permission set matches what the code uses.
- Hot-button eval has been run once on the build that will be uploaded.
- Listing and screenshots match the locked tone.

## Links

- [`../../chrome-web-store.md`](../../chrome-web-store.md) — publish sequence (this checklist is step 2)
- [G-0005](../G-0005-chrome-web-store-and-site-cta.md) — publish + handshake
- [VISION.md](../../VISION.md) — exit ramp; not condemnation of the post’s author
- [CWS hate speech](https://developer.chrome.com/docs/webstore/program-policies/hate-and-violence)
- [CWS review process](https://developer.chrome.com/docs/webstore/review-process)
