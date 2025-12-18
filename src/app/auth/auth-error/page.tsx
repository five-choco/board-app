export default function AuthError() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <h1 className="text-2xl font-bold">認証エラー</h1>
      <p className="text-slate-600">
        認証処理中に問題が発生しました。
      </p>
      <p className="text-slate-600">
        <a href="/login" className="text-blue-600 underline">ログインページ</a>に戻って、もう一度お試しください。
      </p>
    </div>
  )
}
