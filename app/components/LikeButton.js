"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

// table: "article_likes" | "reply_likes"
// column: "article_id" | "reply_id"
// authorId: profile id of the content's author, used to notify them of the like
// notifyType: "article" | "reply"
export default function LikeButton({ table, column, targetId, authorId, notifyType, contentTitle }) {
  const { user, profile } = useAuth();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from(table).select("id, user_id").eq(column, targetId).then(({ data }) => {
      setCount(data?.length || 0);
      const mine = data?.find((r) => r.user_id === user?.id);
      setLiked(!!mine);
      setLikeId(mine?.id || null);
    });
  }, [targetId, user?.id]);

  async function toggle() {
    if (!user || busy) return;
    setBusy(true);
    if (liked) {
      await supabase.from(table).delete().eq("id", likeId);
      setCount((c) => Math.max(0, c - 1));
      setLiked(false);
      setLikeId(null);
    } else {
      const { data } = await supabase.from(table).insert({ [column]: targetId, user_id: user.id }).select().single();
      setCount((c) => c + 1);
      setLiked(true);
      setLikeId(data?.id || null);
      if (authorId && authorId !== user.id) {
        fetch("/api/notify-like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorId, likerName: profile?.name, type: notifyType, title: contentTitle }),
        }).catch(() => {});
      }
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={!user || busy}
      className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors ${liked ? "text-amber" : "text-charcoal-soft hover:text-charcoal"} ${!user ? "cursor-default opacity-60" : ""}`}
      title={user ? undefined : "Sign in to like"}
    >
      <Heart size={14} fill={liked ? "currentColor" : "none"} /> {count}
    </button>
  );
}
