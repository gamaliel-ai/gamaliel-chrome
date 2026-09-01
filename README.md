# gamaliel-chrome

Chrome extension (Manifest V3) that suggests Scripture for the post or text in front of you — an exit ramp from social media toward a renewed mind in Christ. Safari support may come later from the same WXT project.

Vision for this extension: [docs/VISION.md](docs/VISION.md). Engineering tickets: [docs/BACKLOG.md](docs/BACKLOG.md) (`G-NNNN`; conventions in [docs/README.md](docs/README.md)). Broader product (including iOS share) is in [`gamaliel-web`](https://github.com/gamaliel-ai/gamaliel-web): `docs/social-to-scripture-product-concept.md`.

Remote: `git@github.com:gamaliel-ai/gamaliel-chrome.git`.

## Requirements

- **Node 22** via [nvm](https://github.com/nvm-sh/nvm)
- npm (ships with Node 22)

```bash
cd /Users/cirne/dev/gamaliel-chrome
nvm use          # reads .nvmrc → 22
node -v          # v22.x
npm install
```

If `node` / `npx` are missing from PATH, load nvm first:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use
```

## Scripts

| Command | What it does |
| --- | --- |
| `nvm use && npm run dev` | WXT dev (load unpacked from `dist/chrome-mv3`) |
| `nvm use && npm run build` | Production Chrome build |
| `nvm use && npm run zip` | Zip for Chrome Web Store ([docs/chrome-web-store.md](docs/chrome-web-store.md)) |
| `nvm use && npm run compile` | `tsc --noEmit` |
| `nvm use && npm test` | Unit tests (vitest) |

Load unpacked from `dist/chrome-mv3` after `npm run build` (or `npm run dev`). Toolbar icon opens the side panel. Ask Gamaliel streams `POST /v1/chat/completions`.

Firefox scripts are leftover WXT defaults; Chrome is the target.

## Stack

WXT · React · TypeScript · Node 22. Talks to the Gamaliel public API (`POST /v1/chat/completions` for the Hello World side panel).
