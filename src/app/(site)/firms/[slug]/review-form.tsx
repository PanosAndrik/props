"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({
  firmId,
  firmName,
}: {
  firmId: string;
  firmName: string;
}) {
  const router = useRouter();
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
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Could not submit review.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border border-zinc-200 bg-white p-5"
    >
      <p className="text-sm font-medium">Review {firmName}</p>

      <label className="mt-3 block text-sm text-zinc-600">
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
      </label>

      <label className="mt-3 block text-sm text-zinc-600">
        Title (optional)
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
        />
      </label>

      <label className="mt-3 block text-sm text-zinc-600">
        Your review
        <textarea
          required
          minLength={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-zinc-600">{message}</p>
      )}
    </form>
  );
}
