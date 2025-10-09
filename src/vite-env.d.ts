/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_USER_POOL_CLIENT_ID: string;
  readonly VITE_USER_POOL_ID: string;
}

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}
