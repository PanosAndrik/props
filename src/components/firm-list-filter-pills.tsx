"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FIRM_SORT_OPTIONS, type FirmSortKey } from "@/lib/firm-sort";

const FILTER_PILLS = [
  { id: "all", label: "All" },
  { id: "forex", label: "Forex", category: "forex" },
  { id: "futures", label: "Futures", category: "futures" },
  { id: "crypto", label: "Crypto", category: "crypto" },
  { id: "under100", label: "Under $100", maxFee: "100" },
  { id: "instant", label: "Instant funded", instant: "1" },
  { id: "coupon", label: "With coupon", coupon: "1" },
] as const;

const pillClass = (on: boolean) =>
  `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
    on
      ? "border-zinc-900 bg-zinc-900 text-white"
      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
  }`;

function hrefWithParams(
  searchParams: URLSearchParams,
  filter?: { category?: string; maxFee?: string; instant?: string; coupon?: string }
) {
  const next = new URLSearchParams();
  const q = searchParams.get("q");
  const asset = searchParams.get("asset");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort");
  if (q) next.set("q", q);
  if (asset) next.set("asset", asset);
  if (featured) next.set("featured", featured);
  if (sort) next.set("sort", sort);
  if (filter?.category) next.set("category", filter.category);
  if (filter?.maxFee) next.set("maxFee", filter.maxFee);
  if (filter?.instant) next.set("instant", filter.instant);
  if (filter?.coupon) next.set("coupon", filter.coupon);
  const qs = next.toString();
  return qs ? `/firms?${qs}` : "/firms";
}

export function FirmListFilterPills() {
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as FirmSortKey) || "rank";

  function isFilterActive(id: string) {
    switch (id) {
      case "all":
        return (
          !searchParams.get("category") &&
          !searchParams.get("maxFee") &&
          !searchParams.get("instant") &&
          !searchParams.get("coupon")
        );
      case "forex":
        return searchParams.get("category") === "forex";
      case "futures":
        return searchParams.get("category") === "futures";
      case "crypto":
        return searchParams.get("category") === "crypto";
      case "under100":
        return searchParams.get("maxFee") === "100";
      case "instant":
        return searchParams.get("instant") === "1";
      case "coupon":
        return searchParams.get("coupon") === "1";
      default:
        return false;
    }
  }

  function filterHref(id: string) {
    if (id === "all" || isFilterActive(id)) {
      return hrefWithParams(searchParams);
    }
    switch (id) {
      case "forex":
        return hrefWithParams(searchParams, { category: "forex" });
      case "futures":
        return hrefWithParams(searchParams, { category: "futures" });
      case "crypto":
        return hrefWithParams(searchParams, { category: "crypto" });
      case "under100":
        return hrefWithParams(searchParams, { maxFee: "100" });
      case "instant":
        return hrefWithParams(searchParams, { instant: "1" });
      case "coupon":
        return hrefWithParams(searchParams, { coupon: "1" });
      default:
        return "/firms";
    }
  }

  function sortHref(sort: FirmSortKey) {
    const next = new URLSearchParams(searchParams.toString());
    if (sort === "rank") next.delete("sort");
    else next.set("sort", sort);
    const qs = next.toString();
    return qs ? `/firms?${qs}` : "/firms";
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_PILLS.map((pill) => (
        <Link key={pill.id} href={filterHref(pill.id)} className={pillClass(isFilterActive(pill.id))}>
          {pill.label}
        </Link>
      ))}
      <span className="mx-1 hidden h-8 w-px self-center bg-zinc-200 sm:block" aria-hidden />
      {FIRM_SORT_OPTIONS.map((opt) => (
        <Link
          key={opt.value}
          href={sortHref(opt.value)}
          className={pillClass(currentSort === opt.value)}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
