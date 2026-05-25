import Link from "next/link";
import { Suspense } from "react";
import { FirmsRankingTable } from "@/components/firms-ranking-table";
import { HomeFilterPills } from "@/components/home-filter-pills";
import type { FirmSortKey, FirmWithReviews } from "@/lib/firm-sort";

export function HomeRankingsSection({
  firms,
  sort,
  totalFirmCount,
}: {
  firms: FirmWithReviews[];
  sort: FirmSortKey;
  totalFirmCount: number;
}) {
  return (
    <section id="rankings" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-6 pt-2">
      <h2 className="mb-3 text-lg font-bold sm:text-xl">Prop firm rankings</h2>

      <Suspense fallback={<div className="h-14 animate-pulse rounded-xl bg-zinc-100" />}>
        <HomeFilterPills sort={sort} />
      </Suspense>

      <p className="mt-3 text-sm text-zinc-500">
        {firms.length} shown · {totalFirmCount} total firms
      </p>

      <div className="mt-4">
        {firms.length > 0 ? (
          <FirmsRankingTable firms={firms} sort={sort} />
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
            <p className="font-medium text-zinc-800">No firms match this filter</p>
            <p className="mt-2 text-sm text-zinc-500">
              Try another category or clear filters to see all firms.
            </p>
            <Link
              href="/"
              scroll={false}
              className="mt-4 inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>

      <p className="mt-4">
        <Link
          href="/firms"
          scroll={false}
          className="inline-flex rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          View all {totalFirmCount}+ firms →
        </Link>
      </p>
    </section>
  );
}
