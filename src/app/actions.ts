'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=投稿するにはログインが必要です')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title.trim() || !content.trim()) {
    return redirect('/?error=タイトルと内容は空にできません')
  }

  const { error } = await supabase.from('posts').insert({
    title,
    content,
    user_id: user.id,
  })

  if (error) {
    console.error('Error creating post:', error)
    return redirect('/?error=投稿の作成に失敗しました')
  }

  revalidatePath('/')
  redirect('/')
}

export async function updatePost(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=投稿を更新するにはログインが必要です')
  }

  const postId = formData.get('postId') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!postId) {
    return redirect('/?error=投稿IDが見つかりません')
  }

  if (!title.trim() || !content.trim()) {
    return redirect('/?error=タイトルと内容は空にできません')
  }

  // RLS will ensure that the user can only update their own posts.
  const { error } = await supabase
    .from('posts')
    .update({ title, content })
    .eq('id', postId)

  if (error) {
    console.error('Error updating post:', error)
    return redirect('/?error=投稿の更新に失敗しました')
  }

  revalidatePath('/')
  redirect('/')
}

export async function deletePost(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=投稿を削除するにはログインが必要です')
  }

  const postId = formData.get('postId') as string

  if (!postId) {
    return redirect('/?error=投稿IDが見つかりません')
  }

  // RLS will ensure that the user can only delete their own posts.
  const { error } = await supabase.from('posts').delete().eq('id', postId)

  if (error) {
    console.error('Error deleting post:', error)
    return redirect('/?error=投稿の削除に失敗しました')
  }

  revalidatePath('/')
  redirect('/')
}
