# G-0004: Send what the user is looking at as a picture, not only text

**Status:** Deferred — after text capture dogfood; needs API multimodal support  
**Type:** improvement  
**Priority:** P2 — image-heavy feeds are a real hole, not a first-prototype cut  
**Created:** 2026-08-23

## Locked decisions

| Decision | Choice |
| -------- | ------ |
| Capture unit | Viewport **screenshot** (same idea as iOS Share), not scraping `<img src>` / CDN URLs. |
| How the model sees it | **One multimodal chat call** — existing text prompt **plus** an image part. No separate “describe the image” LLM pass as the happy path. |
| How bytes reach the provider | Extension captures pixels; **Gamaliel API** forwards them. Backend must **never** `GET` Instagram / X / TikTok media URLs. |
| Page URL | Citation in the text prompt only (“I am on Instagram”). Not a fetch target. |
| Video | Still (poster / current frame if possible, else the tab screenshot) + existing caption/title text. Do **not** upload the video file. Transcript only if the page already exposes one. |
| Persistence | Ephemeral, same bar as page text. Do not store screenshots unless we later need debug. |

## Problem / goal

[G-0001](G-0001-hello-world.md) capture is **text-only**: viewport DOM text + selection + title/URL. Most of what people actually look at on social is a **picture or video**. Surrounding captions are not “what I’m looking at.”

Social CDNs will not let `api.gamaliel.ai` download those assets by URL (signed links, cookies, referrer locks). The extension already has the privileged view.

iOS already treats a screenshot as the capture unit (`gamaliel-ios-macos`). Chrome should send the same *kind* of evidence.

## Depends on

- **This repo:** [G-0001](G-0001-hello-world.md) text path is the baseline. Keep it; add an image part. Do not replace text.
- **gamaliel-web:** `POST /v1/chat/completions` must accept OpenAI-style multimodal `content` (image part as data URL or a short-lived URL **we** host). Confirm hosted-mode size limits and whether preflight ([web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228)) understands image parts. File or extend a web ticket before implementing the client if the API is still text-only.
- **[G-0002](G-0002-hosted-api-no-client-key.md)** does not block a local dogfood with a key, but vision tokens are expensive — hosted mode + rate limits matter more once this ships.

## Direction

### Capture (extension)

- On Ask, take a **visible-tab screenshot** (`chrome.tabs.captureVisibleTab` or equivalent). Add the manifest permission that requires (`<all_urls>` or `activeTab`).
- Downscale before send (e.g. longest edge ~1280–1600, JPEG/WebP ~0.7). A few hundred KB, not a 4K PNG.
- Keep the existing `PageSnapshot` text fields. Image **supplements** captions and selection.
- Later (out of this ticket if it stays large): host adapters **crop to the focused post** so we don’t send a whole feed. First cut of the whole viewport is OK — same honesty as Hello World’s whole-view text.

### API payload

- Background SW POSTs text messages **and** image bytes to the existing chat endpoint.
- Preferred shapes: `multipart/form-data`, or JSON with `data:image/jpeg;base64,…` in an `image_url` part. If payloads are too large for JSON, upload to a **5-minute blob we control** and pass *that* URL to the provider.
- Do not fetch `img.src`, `video.src`, or `og:image` from the server.

### Fallback

- If vision fails or the image is rejected (size, `content_filter`), keep today’s text-only ask. Optional later: a caption-only pass **only** as fallback, not the default.

## Out of scope

- Per-post crop / host adapters (follow-on; mentioned in [VISION.md](../VISION.md) step 2)
- Sending or transcoding video files
- OCR-only pipeline
- Changing theology/profile prompt intent
- Auto-run on every page (still will-not-do — vision makes that worse)
- iOS Share (other repo)

## Done when

- Ask on an image-heavy page (meme, Instagram-style post) streams an answer that clearly used **visual** content, not only captions.
- The API never needs a social CDN URL to see the picture.
- Visible text + selection still go in the prompt.
- Video posts degrade to a still + text, not a failed download.
- Failed vision still yields a text-only answer instead of a hard error.

## Links

- [G-0001](G-0001-hello-world.md) — text snapshot + chat stream
- [VISION.md](../VISION.md) — iOS screenshot is the sibling capture story
- [gamaliel-web#228](https://github.com/gamaliel-ai/gamaliel-web/issues/228) — preflight vs cited content
