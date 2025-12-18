import { createClient } from "@/utils/supabase/server";
import { createPost } from "@/app/actions";
import Link from "next/link";
import RealtimePosts from "./realtime-posts";

export default async function Home({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-slate-50 font-sans">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            掲示板
          </h1>
        </header>

        <div className="max-w-2xl mx-auto">
          {/* Create Post Form */}
          {user ? (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200 mb-12">
              <form action={createPost} className="space-y-4">
                <div>
                  <label htmlFor="title" className="sr-only">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="タイトル"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="content" className="sr-only">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    placeholder="投稿する内容を入力してください"
                    rows={5}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full text-white font-semibold py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                >
                  投稿する
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-slate-200 mb-12">
              <h3 className="text-lg font-medium text-slate-700">
                投稿するにはログインが必要です
              </h3>
              <p className="text-slate-500 mt-2">
                <Link href="/login" className="text-blue-600 underline">
                  ログインページへ
                </Link>
              </p>
            </div>
          )}
          {searchParams.error && (
            <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg mb-6">
              エラー: {searchParams.error}
            </p>
          )}
          {/* Posts Feed */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-6">
              投稿一覧
            </h2>
            {postsError ? (
              <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
                投稿の取得中にエラーが発生しました: {postsError.message}
              </p>
            ) : posts && posts.length === 0 ? (
              <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-medium text-slate-700">
                  まだ投稿がありません！
                </h3>
                <p className="text-slate-500 mt-1">
                  最初の投稿をしてみましょう。
                </p>
              </div>
            ) : (
              <RealtimePosts serverPosts={posts ?? []} user={user} />
            )}
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
