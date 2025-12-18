'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/login?message=' + encodeURIComponent('エラー: メールアドレスとパスワードを入力してください。'))
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const errorMessage = encodeURIComponent(error.message.replace(/[\r\n]/g, ' '))
    return redirect('/login?message=' + encodeURIComponent('エラー: ') + errorMessage)
  }

  return redirect('/')
}

export async function signUp(formData: FormData) {
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/register?message=' + encodeURIComponent('エラー: メールアドレスとパスワードを入力してください。'))
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return redirect('/register?message=' + encodeURIComponent('エラー: 有効なメールアドレスを入力してください。'))
  }
  if (password.length < 6) {
    return redirect('/register?message=' + encodeURIComponent('エラー: パスワードは6文字以上で入力してください。'))
  }
  const hasAlpha = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  if (!hasAlpha || !hasNumber) {
    return redirect('/register?message=' + encodeURIComponent('エラー: パスワードには英字と数字の両方を含めてください。'))
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    const errorMessage = encodeURIComponent(error.message.replace(/[\r\n]/g, ' '))
    return redirect('/register?message=' + encodeURIComponent('エラー: ') + errorMessage)
  }

  return redirect('/login?message=' + encodeURIComponent('確認メールを送信しました。メールボックスをご確認ください。'))
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/')
}
