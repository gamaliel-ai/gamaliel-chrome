/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WXT_GAMALIEL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
