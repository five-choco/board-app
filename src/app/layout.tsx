import "./globals.css";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/login/actions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bulletin Board v2",
  description: "A stylish bulletin board application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ja">
      <body>
        <header className="bg-slate-800 text-white p-4 mb-8">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              掲示板
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span>{user.email}</span>
                  <form action={signOut}>
                    <button className="bg-slate-600 hover:bg-slate-700 rounded px-3 py-1">
                      ログアウト
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-1">
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
