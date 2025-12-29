/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  // here goes the env variables for the app
  readonly VITE_API_ENV: 'development' | 'qa' | 'staging' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
