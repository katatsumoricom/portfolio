// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { createClient } from "microcms-js-sdk";

// 共通のフィールド
const microCMSDateFields = {
 createdAt: z.string(),
 updatedAt: z.string(),
 publishedAt: z.string(),
 revisedAt: z.string(),
};

// microCMSのコンテンツローダー
const microCMSLoader = (endpoint: string) => {
 return async () => {
   /* ==========================================
      ★ 修正ポイント1: 環境変数の取得を関数内部に移動
      ========================================== */
   const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN || process.env.MICROCMS_SERVICE_DOMAIN;
   const apiKey = import.meta.env.MICROCMS_API_KEY || process.env.MICROCMS_API_KEY;

   // もし万が一環境変数が届いていなくても、即死させずに分かりやすいエラーをログに出す
   if (!serviceDomain || !apiKey) {
     console.error(`【警告】microCMSの環境変数が見つかりません。Cloudflareのダッシュボード設定を確認してください。`);
     return [];
   }

   try {
     /* ==========================================
        ★ 修正ポイント2: クライアントの作成をここに移動
        これによって初期読み込み時のクラッシュを100%回避します
        ========================================== */
     const client = createClient({
       serviceDomain,
       apiKey,
     });

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
