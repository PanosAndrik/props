"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FIRM_SORT_OPTIONS, type FirmSortKey } from "@/lib/firm-sort";

export function FirmFilters({
  assetOptions,
  showCategory,
  showSort = true,
}: {
  assetOptions: string[];
  showCategory?: boolean;
  showSort?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const currentSort = (params.get("sort") as FirmSortKey) || "rank";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/firms?${next.toString()}`);
  }

  function buildSortHref(sort: FirmSortKey) {
    const next = new URLSearchParams(params.toString());
    if (sort === "rank") next.delete("sort");
    else next.set("sort", sort);
    return `/firms?${next.toString()}`;
  }

  return (
    <div className="mt-6 space-y-4">
      {showSort && (
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs font-medium uppercase text-zinc-500">
            Sort by
          </span>
          {FIRM_SORT_OPTIONS.map((opt) => {
            const active = currentSort === opt.value;
            return (
              <Link
                key={opt.value}
                href={buildSortHref(opt.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search firms…"
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            clearTimeout(
              (window as unknown as { _firmSearch?: ReturnType<typeof setTimeout> })
                ._firmSearch
            );
            (
              window as unknown as { _firmSearch?: ReturnType<typeof setTimeout> }
            )._firmSearch = setTimeout(() => update("q", v), 300);
          }}
          className="min-w-[200px] flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        {showSort && (
          <select
            value={currentSort}
            onChange={(e) => update("sort", e.target.value === "rank" ? "" : e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            aria-label="Sort firms"
          >
            {FIRM_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        <select
          defaultValue={params.get("asset") ?? ""}
          onChange={(e) => update("asset", e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All assets</option>
          {assetOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {showCategory && (
          <select
            defaultValue={params.get("category") ?? ""}
            onChange={(e) => update("category", e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            <option value="forex">Forex</option>
            <option value="futures">Futures</option>
            <option value="crypto">Crypto</option>
          </select>
        )}
        <label className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={params.get("featured") === "1"}
            onChange={(e) => update("featured", e.target.checked ? "1" : "")}
          />
          Featured only
        </label>
      </div>
    </div>
  );
}
