# リアルタイム掲示板アプリ

Next.js、Supabase、Tailwind CSSで構築された、モダンな掲示板アプリケーションです。投稿のリアルタイム更新やユーザー認証機能を備えています。

## ✨ 主な機能

- **ユーザー認証**: Supabase Authによる安全なサインアップ、ログイン、セッション管理機能。
- **投稿の作成と閲覧**: 認証済みのユーザーは、タイトルと内容を含む新しい投稿を作成できます。
- **リアルタイム更新**: 新しい投稿が作成、更新、または削除されると、投稿フィードがリアルタイムで更新されます。
- **投稿の編集と削除**: ユーザーは自分自身の投稿を編集または削除できます。
- **モダンなUI**: Tailwind CSSで構築された、クリーンでレスポンシブなユーザーインターフェース。

## 🚀 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) (App Router)
- **データベース & 認証**: [Supabase](https://supabase.io/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)

## 🛠️ はじめに

開発環境をセットアップするための手順は以下の通りです。

### 1. リポジトリをクローンする

```bash
git clone <リポジトリのURL>
cd board-app
```

### 2. 依存関係をインストールする

```bash
npm install
```

### 3. Supabaseをセットアップする

1.  [supabase.com](https://supabase.com)にアクセスし、新しいプロジェクトを作成します。
2.  Supabaseプロジェクトのダッシュボードで**SQL Editor**に移動します。
3.  以下のSQLクエリを実行して、`posts`テーブルを作成します。

    ```sql
    -- postsテーブルを作成します
    CREATE TABLE public.posts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id UUID REFERENCES auth.users(id) NOT NULL
    );

    -- postsテーブルでリアルタイム機能を有効にします
    ALTER TABLE public.posts REPLICA IDENTITY FULL;
    CREATE PUBLICATION supabase_realtime FOR TABLE public.posts;
    ```

4.  Row Level Security (RLS)ポリシーを設定してデータを保護します。SQL Editorで以下のクエリを実行してください。

    ```sql
    -- postsテーブルでRLSを有効にします
    ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

    -- ポリシー: 公開読み取りアクセスを許可します
    CREATE POLICY "Allow public read access"
    ON public.posts
    FOR SELECT
    USING (true);

    -- ポリシー: ユーザーが自分自身の投稿を挿入できるようにします
    CREATE POLICY "Allow users to insert their own posts"
    ON public.posts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    -- ポリシー: ユーザーが自分自身の投稿を更新できるようにします
    CREATE POLICY "Allow users to update their own posts"
    ON public.posts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

    -- ポリシー: ユーザーが自分自身の投稿を削除できるようにします
    CREATE POLICY "Allow users to delete their own posts"
    ON public.posts
    FOR DELETE
    USING (auth.uid() = user_id);
    ```

### 4. 環境変数を設定する

1.  Supabaseプロジェクトの設定（APIセクション）で、プロジェクトの**URL**と**anonキー**を見つけます。
2.  サンプルファイルをコピーして、プロジェクトのルートに`.env.local`ファイルを作成します。
    ```bash
    cp .env.local.example .env.local
    ```
3.  `.env.local`ファイルにSupabaseのURLとanonキーを追加します。

    ```
    NEXT_PUBLIC_SUPABASE_URL=あなたのSUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSUPABASE_ANON_KEY
    ```

### 5. 開発サーバーを起動する

開発サーバーを起動し、ブラウザでアプリを開きます。

```bash
npm run dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開き、結果を確認してください。
