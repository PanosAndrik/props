"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const RATINGS = [5, 4, 3, 2, 1] as const;

export function ReviewsFilters({ firms }: { firms: { slug: string; name: string }[] }) {
  const searchParams = useSearchParams();
  const activeFirm = searchParams.get("firm") ?? "";
  const activeRating = searchParams.get("rating") ?? "";

  function href(overrides: { firm?: string; rating?: string; page?: string }) {
    const next = new URLSearchParams();
    const firm = overrides.firm !== undefined ? overrides.firm : activeFirm;
    const rating = overrides.rating !== undefined ? overrides.rating : activeRating;
    if (firm) next.set("firm", firm);
    if (rating) next.set("rating", rating);
    if (overrides.page) next.set("page", overrides.page);
    const qs = next.toString();
    return qs ? `/reviews?${qs}` : "/reviews";
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <select
        defaultValue={activeFirm}
        onChange={(e) => {
          window.location.href = href({ firm: e.target.value, page: "" });
        }}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        aria-label="Filter by firm"
      >
        <option value="">All firms</option>
        {firms.map((f) => (
          <option key={f.slug} value={f.slug}>
            {f.name}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        <Link
          href={href({ rating: "", page: "" })}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            !activeRating ? "bg-zinc-900 text-white" : "bg-white ring-1 ring-zinc-200 text-zinc-700"
          }`}
        >
          All ratings
        </Link>
        {RATINGS.map((r) => (
          <Link
            key={r}
            href={href({ rating: String(r), page: "" })}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              activeRating === String(r)
                ? "bg-zinc-900 text-white"
                : "bg-white ring-1 ring-zinc-200 text-zinc-700"
            }`}
          >
            {r}★
          </Link>
        ))}
      </div>
    </div>
  );
}
