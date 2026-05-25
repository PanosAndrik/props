"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast-provider";

export function FavoriteButton({
  firmId,
  firmName,
  initialFavorited,
  isLoggedIn,
}: {
  firmId: string;
  firmName: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: favorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firmId }),
      });
      if (!res.ok) throw new Error();
      setFavorited(!favorited);
      toast(favorited ? `Removed ${firmName} from favorites` : `Saved ${firmName} to favorites`);
      router.refresh();
    } catch {
      toast("Could not update favorites. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        favorited
          ? "border-amber-400 bg-amber-50 text-amber-900"
          : "border-zinc-300 text-zinc-800 hover:bg-zinc-50"
      }`}
      aria-pressed={favorited}
    >
      {favorited ? "★ Saved" : "☆ Save firm"}
    </button>
  );
}
