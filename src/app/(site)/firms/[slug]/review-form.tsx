"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";

export function ReviewForm({
  firmId,
  firmName,
}: {
  firmId: string;
  firmName: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firmId, rating, title, body }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      setBody("");
      setMessage("Review submitted — waiting for admin approval.");
      toast("Review submitted — pending approval");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      const err = data.error ?? "Could not submit review.";
      setMessage(err);
      toast(err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border border-zinc-300 bg-white p-5 text-zinc-900 shadow-sm"
    >
      <p className="text-sm font-semibold text-zinc-900">Review {firmName}</p>

      <label className="mt-3 block text-sm text-zinc-700">
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
      </label>

      <label className="mt-3 block text-sm text-zinc-700">
        Title (optional)
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
        />
      </label>

      <label className="mt-3 block text-sm text-zinc-700">
        Your review
        <textarea
          required
          minLength={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-zinc-600">{message}</p>
      )}
    </form>
  );
}
