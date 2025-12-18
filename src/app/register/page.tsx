import { signUp } from '../login/actions' // signUpアクションをインポート
import Link from 'next/link'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
      >
        <h2 className="text-2xl font-bold text-center mb-6">新規登録</h2>
        <label className="text-md" htmlFor="email">
          メールアドレス
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          パスワード
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <p className="text-sm text-gray-500 -mt-4 mb-4">パスワードは6文字以上、英字と数字の両方を含めてください。</p>
        <button formAction={signUp} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mb-2">
          新規登録
        </button>
        <Link href="/login" className="border border-slate-300 rounded px-4 py-2 mb-2 text-center">
          ログインページへ戻る
        </Link>
        {searchParams?.message && (
          <p
            className={`mt-4 p-4 text-center rounded-lg ${
              searchParams.message.startsWith('エラー:')
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
