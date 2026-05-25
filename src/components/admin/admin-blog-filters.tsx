"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BLOG_CATEGORIES, BLOG_DIFFICULTIES } from "@/lib/blog-meta";

const SORT_OPTIONS = [
  { value: "updated_desc", label: "Updated (newest)" },
  { value: "updated_asc", label: "Updated (oldest)" },
  { value: "published_desc", label: "Published (newest)" },
  { value: "published_asc", label: "Published (oldest)" },
  { value: "title_asc", label: "Title A–Z" },
] as const;

const DEFAULT_SORT = "updated_desc";

export function AdminBlogFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const qParam = params.get("q") ?? "";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const sort = params.get("sort") ?? DEFAULT_SORT;
  const category = params.get("category") ?? "";
  const difficulty = params.get("difficulty") ?? "";
  const status = params.get("status") ?? "";

  const [searchInput, setSearchInput] = useState(qParam);

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  function applyParams(next: URLSearchParams) {
    const qs = next.toString();
    router.replace(qs ? `/admin/blog?${qs}` : "/admin/blog");
  }

  function push(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    applyParams(next);
  }

  function onSearchChange(value: string) {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      push({ q: value.trim() || null });
    }, 300);
  }

  const hasFilters =
    qParam ||
    category ||
    difficulty ||
    status ||
    from ||
    to ||
    sort !== DEFAULT_SORT;

  function clearAll() {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
    setSearchInput("");
    router.replace("/admin/blog");
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-zinc-600">Search</label>
          <input
            type="search"
            placeholder="Title, slug, excerpt…"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Sort by</label>
          <select
            className={`${inputClass} mt-1`}
            value={sort}
            onChange={(e) =>
              push({ sort: e.target.value === DEFAULT_SORT ? null : e.target.value })
            }
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium text-zinc-600">Category</label>
          <select
            className={`${inputClass} mt-1`}
            value={category}
            onChange={(e) => push({ category: e.target.value || null })}
          >
            <option value="">All</option>
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Difficulty</label>
          <select
            className={`${inputClass} mt-1`}
            value={difficulty}
            onChange={(e) => push({ difficulty: e.target.value || null })}
          >
            <option value="">All</option>
            {BLOG_DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Status</label>
          <select
            className={`${inputClass} mt-1`}
            value={status}
            onChange={(e) => push({ status: e.target.value || null })}
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex items-end">
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              Clear filters
            </button>
          ) : (
            <span className="text-sm text-zinc-400">No filters active</span>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-zinc-600">Updated from</label>
          <input
            type="date"
            className={`${inputClass} mt-1`}
            value={from}
            onChange={(e) => push({ from: e.target.value || null })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Updated to</label>
          <input
            type="date"
            className={`${inputClass} mt-1`}
            value={to}
            onChange={(e) => push({ to: e.target.value || null })}
          />
        </div>
      </div>
    </div>
  );
}
