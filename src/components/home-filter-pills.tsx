"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FirmSortKey } from "@/lib/firm-sort";

const FILTER_PILLS = [
  { id: "all", label: "All" },
  { id: "forex", label: "Forex", category: "forex" },
  { id: "futures", label: "Futures", category: "futures" },
  { id: "crypto", label: "Crypto", category: "crypto" },
  { id: "under100", label: "Under $100", maxFee: "100" },
  { id: "instant", label: "Instant funded", instant: "1" },
  { id: "coupon", label: "With coupon", coupon: "1" },
] as const;

const SORT_PILLS: { id: string; label: string; sort?: FirmSortKey }[] = [
  { id: "rank", label: "Editorial rank", sort: "rank" },
  { id: "rating", label: "By rating", sort: "rating" },
  { id: "allocation", label: "By allocation", sort: "allocation" },
  { id: "fee", label: "By fee", sort: "fee" },
];

const pillClass = (on: boolean) =>
  `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
    on
      ? "border-zinc-900 bg-zinc-900 text-white"
      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
  }`;

/** Build URL keeping current sort; optional single exclusive filter (or none for All). */
function hrefWithSort(
  searchParams: URLSearchParams,
  filter?: {
    category?: string;
    maxFee?: string;
    instant?: string;
    coupon?: string;
  }
) {
  const next = new URLSearchParams();
  const sortParam = searchParams.get("sort");
  if (sortParam) next.set("sort", sortParam);

  if (filter?.category) next.set("category", filter.category);
  if (filter?.maxFee) next.set("maxFee", filter.maxFee);
  if (filter?.instant) next.set("instant", filter.instant);
  if (filter?.coupon) next.set("coupon", filter.coupon);

  const qs = next.toString();
  return qs ? `/?${qs}` : "/";
}

export function HomeFilterPills({ sort }: { sort: FirmSortKey }) {
  const searchParams = useSearchParams();

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
    if (id === "all") {
      return hrefWithSort(searchParams);
    }

    if (isFilterActive(id)) {
      return hrefWithSort(searchParams);
    }

    switch (id) {
      case "forex":
        return hrefWithSort(searchParams, { category: "forex" });
      case "futures":
        return hrefWithSort(searchParams, { category: "futures" });
      case "crypto":
        return hrefWithSort(searchParams, { category: "crypto" });
      case "under100":
        return hrefWithSort(searchParams, { maxFee: "100" });
      case "instant":
        return hrefWithSort(searchParams, { instant: "1" });
      case "coupon":
        return hrefWithSort(searchParams, { coupon: "1" });
      default:
        return "/";
    }
  }

  function sortHref(pill: (typeof SORT_PILLS)[number]) {
    const next = new URLSearchParams(searchParams.toString());
    if (pill.sort === "rank") {
      next.delete("sort");
    } else if (pill.sort) {
      next.set("sort", pill.sort);
    }
    const qs = next.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_PILLS.map((pill) => (
        <Link
          key={pill.id}
          href={filterHref(pill.id)}
          scroll={false}
          className={pillClass(isFilterActive(pill.id))}
        >
          {pill.label}
        </Link>
      ))}

      <span className="mx-1 hidden h-8 w-px self-center bg-zinc-200 sm:block" aria-hidden />

      {SORT_PILLS.map((pill) => {
        const on = sort === pill.sort;
        return (
          <Link key={pill.id} href={sortHref(pill)} scroll={false} className={pillClass(on)}>
            {pill.label}
          </Link>
        );
      })}

      <Link href="/firms" scroll={false} className={pillClass(false)}>
        Full table →
      </Link>
    </div>
  );
}
