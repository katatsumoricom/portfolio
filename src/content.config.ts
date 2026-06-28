import { defineCollection, z } from "astro:content";
import { createClient } from "microcms-js-sdk";

/* ==========================================
   ★ 追加：Astro公式の安全なルートから環境変数を読み込む
   ========================================== */
import { MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY } from "astro:env/server";

const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN,
  apiKey: MICROCMS_API_KEY,
});

// microCMSのコンテンツローダー
const microCMSLoader = (endpoint: string) => {
 return async () => {
   try {
     console.log(`microCMSから${endpoint}データを取得中...`);
     const response = await client.getAllContents({
       endpoint
     });
     console.log(`${response.length}件の${endpoint}を取得しました`);
     return response;
   } catch (error) {
     console.error(`microCMSからの${endpoint}取得に失敗:`, error);
     return [];
   }
 };
};

// 共通のフィールド
const microCMSDateFields = {
 createdAt: z.string(),
 updatedAt: z.string(),
 publishedAt: z.string(),
 revisedAt: z.string(),
};

// コレクションの定義
const portfolio = defineCollection({
 loader: microCMSLoader('portfolio'),
 schema: z.object({
  sortNumber: z.number().optional(),
    categories:z.array(z.string()),
   title: z.string(),
   text: z.string().optional(),

   links:z.object({
urlText:z.string().optional(),
url:z.string().url().optional(),
   }).optional(),

   thumbnail:z.object({
    url: z.string().url(),
      height: z.number(),
      width: z.number(),
   }).optional(),
   ...microCMSDateFields,
 }),
});

// コレクションのエクスポート
export const collections = {
 portfolio,
};
