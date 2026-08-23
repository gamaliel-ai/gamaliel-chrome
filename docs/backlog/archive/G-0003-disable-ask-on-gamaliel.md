# G-0003: Hide Ask when the active tab is Gamaliel

**Status:** Shipped 2026-08-23 — Hide Ask on gamaliel.ai; last answer stays; Ask returns on other tabs.  
**Type:** improvement  
**Priority:** P2  
**Created:** 2026-08-23

## Problem

After an answer, a scripture click focuses the shared Gamaliel reader. The side panel stays open (good) and still shows Ask. A second submit captures Bible text and runs the social-page prompt — circular and useless.

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Surface | Hide the question field and Ask row while the active tab is Gamaliel. Keep the previous answer. |
| Prompt | Do not special-case the model prompt. Do not reuse the last non-Gamaliel snapshot. |
| Copy | “You're reading Scripture. Switch back to the original page to ask again.” |
| Scope of host | `gamaliel.ai` and `www.gamaliel.ai` only (same as shared-tab patterns). |
| Ask entry | Background refuses Ask if the active tab is Gamaliel (defense in depth). |
| Restore | Re-show Ask when the active tab leaves Gamaliel. |

## Implementation plan

1. Add `isGamalielPageUrl` next to existing tab helpers.
2. Panel: watch `tabs.onActivated` / `tabs.onUpdated`, query the active tab in the current window.
3. When on Gamaliel: hide question + Ask; show the hint; keep markdown; no-op `onAsk`.
4. Background: if the active tab URL is Gamaliel, post an error and do not capture/stream.

**Out of scope:** reader-mode Q&A, snapshot reuse, prompt rewrites, settings changes.

## TDD plan

- `lib/gamaliel-tab.test.ts`: true for `https://gamaliel.ai/read/…` and `www`; false for empty, invalid, `x.com`, `api.gamaliel.ai`.

## Verification

- `npx vitest run lib/gamaliel-tab.test.ts`
- Manual: ask on a normal page → click a scripture link → Ask hidden, answer remains → switch back → Ask returns.

## Key files

| File | Role |
| ---- | ---- |
| `lib/gamaliel-tab.ts` | URL check |
| `entrypoints/sidepanel/App.tsx` | Hide Ask |
| `entrypoints/background.ts` | Refuse Ask |
