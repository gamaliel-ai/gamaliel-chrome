# gamaliel-chrome

Chrome extension (Manifest V3) that suggests Scripture for the post or text in front of you — an exit ramp from social media toward a renewed mind in Christ. Safari support may come later from the same WXT project.

Product concept lives in [`gamaliel-web`](https://github.com/gamaliel-ai/gamaliel-web): `docs/social-to-scripture-product-concept.md`.

Future GitHub remote: `git@github.com:gamaliel-ai/gamaliel-chrome.git` (private). Do not push until the repo is ready.

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
| `nvm use && npm run dev` | WXT dev (load unpacked from `.output/chrome-mv3`) |
| `nvm use && npm run build` | Production Chrome build |
| `nvm use && npm run zip` | Zip for Chrome Web Store |
| `nvm use && npm run compile` | `tsc --noEmit` |

Firefox scripts are leftover WXT defaults; Chrome is the target.

## Stack

WXT · React · TypeScript · Node 22. Talks to the Gamaliel public API (`/v1/scripture/search` first).
