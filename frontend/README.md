# CivicAI Summit 2027

GDGoC KIT（Google Developer Groups on Campus / 金沢工業大学）主催、
CivicAI Summit 2027 の公式サイトです。イベント紹介ページに加えて、Googleログインによる
参加登録・第一部（セッション）応募・第二部（ハッカソン）応募・抽選結果確認・管理者ページを含みます。

現時点では掲載内容の一部（プログラム詳細・参加費など）は仮のプレースホルダーです。

## 技術構成

- Next.js（App Router）/ TypeScript
- Tailwind CSS v4
- react-hook-form + zod（フォームのバリデーション）
- Supabase（Postgres・認証・Row Level Security）— `@supabase/ssr` / `@supabase/supabase-js`

このNext.jsのバージョンは破壊的変更を含みます（例: ミドルウェアが `middleware.ts` ではなく
`src/proxy.ts` の `proxy` エクスポート）。挙動を確認する際は
`node_modules/next/dist/docs/` 配下のドキュメントも参照してください（詳細は `AGENTS.md`）。

## セットアップ

```bash
npm install
cp .env.local.example .env.local  # 値は下記を参照して埋める
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

### 環境変数

`.env.local` に以下を設定してください（Supabaseプロジェクトの Settings > API から取得）。

| 変数名 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseの匿名（anon）キー |

サービスロールキーは使用していません。管理者権限はデータベース側の
`admin_emails` テーブルと Row Level Security で制御しています（詳細は
[`docs/database.md`](docs/database.md)）。

### データベースのセットアップ・更新

スキーマは `supabase/schema.sql` 1ファイルで管理しています（`create table if not exists` /
`add column if not exists` の冪等スタイル）。Supabase CLIでリンク済みのプロジェクトに反映するには：

```bash
supabase link --project-ref <project-ref>
supabase db query --linked --file supabase/schema.sql
```

## ドキュメント

より詳しい内容は `docs/` 以下を参照してください。

- [`docs/architecture.md`](docs/architecture.md) — ページ構成・ディレクトリ構成・デザイントークン
- [`docs/database.md`](docs/database.md) — Supabaseのテーブル・RLS・関数・トリガー
- [`docs/registration-flow.md`](docs/registration-flow.md) — 申込みの流れ（事前登録・受付期間・抽選・チーム編成）
- [`docs/admin-guide.md`](docs/admin-guide.md) — `/admin` の使い方（運営メンバー向け）
- [`docs/content-editing.md`](docs/content-editing.md) — サイト文言・コンテンツの編集方法

## セキュリティ

- ほぼすべての書き込みはSupabaseの匿名キー経由で行われ、Row Level Security
  （本人の行のみ読み書き可・管理者は `admin_emails` に登録されたメールアドレスのみ全件閲覧可）
  で保護しています。
- フォーム入力はすべて zod スキーマ（`src/lib/registration-schema.ts` /
  `src/lib/hackathon-application-schema.ts`）でバリデーションし、画面への表示はReactの自動エスケープに
  任せています（`dangerouslySetInnerHTML` は未使用）。
- `next.config.ts` で CSP・`X-Content-Type-Options`・`X-Frame-Options` などの
  セキュリティヘッダーを設定しています。

## 主なコマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run start    # 本番ビルドの起動
npm run lint     # ESLint
npx tsc --noEmit # 型チェック
```
