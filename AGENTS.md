# Agent notes

## Rebuild after code changes

Whenever you change extension code (panel, background, content scripts, lib used at runtime, styles, manifest/config), rebuild the **unpackaged** extension so Chrome can load the new bits from `dist/chrome-mv3`.

```sh
nvm use
npm run build
```

Do this in the same turn as the code change — do not wait to be asked. A zip (`npm run zip`) is not required for local pickup; the unpacked `dist/chrome-mv3` output is.

Reload the extension on `chrome://extensions` after the build if Chrome does not pick up the files on its own.
