// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});

/* ==========================================
     ★ ここから追加：環境変数のスキーマ定義
     ========================================== */
  env: {
    schema: {
      MICROCMS_SERVICE_DOMAIN: envField.string({ context: 'server', access: 'secret' }),
      MICROCMS_API_KEY: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
