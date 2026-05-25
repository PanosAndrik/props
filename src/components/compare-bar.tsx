"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { compareHref, getCompareSlugs, setCompareSlugs } from "@/lib/compare-storage";

export function CompareBar() {
  const [slugs, setSlugs] = useState<string[]>([]);

  function refresh() {
    setSlugs(getCompareSlugs());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("compare-updated", refresh);
    return () => window.removeEventListener("compare-updated", refresh);
  }, []);

  if (slugs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="text-sm text-zinc-700">
          <span className="font-semibold text-zinc-900">{slugs.length}</span>
          {slugs.length === 1 ? " firm" : " firms"} selected
          {slugs.length < 2 && (
            <span className="text-zinc-500"> · pick one more to compare</span>
          )}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setCompareSlugs([])}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Clear
          </button>
          <Link
            href={compareHref(slugs)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white ${
              slugs.length >= 2
                ? "bg-zinc-900 hover:bg-zinc-700"
                : "pointer-events-none bg-zinc-400"
            }`}
          >
            Compare →
          </Link>
        </div>
      </div>
    </div>
  );
}
