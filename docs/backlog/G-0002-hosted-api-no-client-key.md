# G-0002: Call the public API with no client API key

**Status:** Blocked on gamaliel-web hosted mode  
**Type:** improvement  
**Priority:** P1 — required before ship  
**Created:** 2026-08-23

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Auth | No baked `WXT_GAMALIEL_API_KEY`. Hosted mode on `POST /v1/chat/completions` (server pays). |
| Product token | Do not add one. Anything in the MV3 bundle will leak. |
| BYOK in the panel | Out of scope. Optional later if we want higher limits. |
| Preflight | Do not send `skip_preflight`. Foul page text is a **web** classifier fix, not a Chrome bypass. |

## Problem / goal

[G-0001](G-0001-hello-world.md) ships a dogfoodable panel by embedding a provider key at build time. That is not releasable: the key is in the extension package.

We own the API. First-party traffic should hit hosted mode (no Bearer). Remove the env key from this repo once the API accepts that.

## Depends on

Do not implement the client cut until **hosted mode is on an environment this extension can call** (staging or prod).

- **[gamaliel-web#227](https://github.com/gamaliel-ai/gamaliel-web/issues/227)** — hosted (no BYOK) mode + IP rate limits + model lock. **Blocks this ticket.**
- **[gamaliel-web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228)** — preflight classifies intent, not cited page content. **Does not block the code change**; **does block calling the extension shippable** on ugly feeds (otherwise `400 content_filter`).

## Direction

- Delete `WXT_GAMALIEL_API_KEY` from `.env.example`, `env.d.ts`, README, and `entrypoints/background.ts`.
- `streamGamalielAnswer` must work with an empty/omitted key (OpenAI SDK still needs *some* `apiKey` string — use a placeholder the server ignores in hosted mode, or stop sending `Authorization` if we drop the SDK header).
- Surface API **429** as a human “try again shortly” error, not a missing-key rebuild message.
- Optional: send `X-Gamaliel-Client: chrome-extension` for metrics only (if #227 documents it).

## Out of scope

- Settings UI / user-pasted OpenAI key
- Changing capture or system prompt
- Preflight prompt work (web #228)
- Auto-run on every page (still will-not-do)

## Done when

- A production-shaped build has **no** provider key in source or bundle.
- Ask streams a normal answer against hosted mode.
- Rate-limit responses are understandable.
- README no longer tells people to put `WXT_GAMALIEL_API_KEY` in `.env`.

## Links

- [G-0001](G-0001-hello-world.md) — current baked-key Hello World
- [VISION.md](../VISION.md) — do not auto-run (cost / rate limits)
- [gamaliel-web#227](https://github.com/gamaliel-ai/gamaliel-web/issues/227)
- [gamaliel-web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228)
