"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { deletePost, updatePost } from "@/app/actions";

// This type should ideally be shared between server and client
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string | null; // Can be null for old posts
}

// Define the user type based on what we need
interface User {
  id: string;
}

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function RealtimePosts({
  serverPosts,
  user,
}: {
  serverPosts: Post[];
  user: User | null;
}) {
  const [posts, setPosts] = useState(serverPosts);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setPosts(serverPosts);
  }, [serverPosts]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPosts((currentPosts) => [payload.new as Post, ...currentPosts]);
          }
          if (payload.eventType === "DELETE") {
            setPosts((currentPosts) =>
              currentPosts.filter((post) => post.id !== payload.old.id)
            );
          }
          if (payload.eventType === "UPDATE") {
            setPosts((currentPosts) =>
              currentPosts.map((post) =>
                post.id === payload.new.id ? (payload.new as Post) : post
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleEditClick = (postId: string) => {
    setEditingPostId(postId);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white p-6 sm:p-7 rounded-xl shadow-md border border-slate-200"
        >
          {editingPostId === post.id ? (
            <form action={updatePost} onSubmit={handleCancelEdit}>
              <input type="hidden" name="postId" value={post.id} />
              <div className="space-y-4">
                <input
                  name="title"
                  defaultValue={post.title}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="content"
                  defaultValue={post.content}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-sm text-slate-600 hover:text-slate-800"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="text-sm text-white font-semibold py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  更新する
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                  {post.title}
                </h3>
                {user && user.id === post.user_id && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEditClick(post.id)}
                      className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                    >
                      編集
                    </button>
                    <form action={deletePost}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button
                        type="submit"
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                      >
                        削除
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-4">
                {post.content}
              </p>
              <div className="border-t border-slate-100 pt-4 text-sm text-slate-500 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1.5 inline-block" />
                <span>{new Date(post.created_at).toLocaleString()}</span>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
