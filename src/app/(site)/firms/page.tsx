import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { buildFirmWhere, firmIncludeReviews } from "@/lib/firm-query";
import { FirmFilters } from "@/components/firm-filters";
import { FirmListFilterPills } from "@/components/firm-list-filter-pills";
import { FirmsRankingTable } from "@/components/firms-ranking-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { parseSortKey, sortFirms, sortLabel } from "@/lib/firm-sort";

export const metadata: Metadata = {
  title: "Prop Firm Rankings | PropCompare",
  description: "Browse and filter prop firms by rating, fees, assets, and coupons.",
};

type Props = {
  searchParams: Promise<{
    q?: string;
    asset?: string;
    featured?: string;
    category?: string;
    sort?: string;
    coupon?: string;
    maxFee?: string;
    instant?: string;
  }>;
};

export default async function FirmsPage({ searchParams }: Props) {
  const { q, asset, featured, category, sort: sortParam, coupon, maxFee, instant } =
    await searchParams;
  const sort = parseSortKey(sortParam);

  const firmsRaw = await prisma.propFirm.findMany({
    where: buildFirmWhere({ q, asset, featured, category, coupon, maxFee, instant }),
    include: firmIncludeReviews,
  });

  const firms = sortFirms(firmsRaw, sort);

  const allAssets = await prisma.propFirm.findMany({
    where: { published: true },
    select: { assetTypes: true },
  });
  const assetOptions = [
    ...new Set(
      allAssets.flatMap((f) => f.assetTypes.split(",").map((a) => a.trim()))
    ),
  ]
    .filter(Boolean)
    .sort();

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Firms" }]} />
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Prop firm rankings</h1>
          <p className="mt-2 text-zinc-600">
            Compare firms by rating, country, assets, platforms, and promos.
          </p>
        </div>
        <Link
          href="/compare"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Compare firms →
        </Link>
      </div>

      <Suspense fallback={<div className="mt-4 h-10 animate-pulse rounded-lg bg-zinc-100" />}>
        <div className="mt-4">
          <FirmListFilterPills />
        </div>
      </Suspense>

      <Suspense fallback={null}>
        <FirmFilters assetOptions={assetOptions} showCategory={false} showSort={false} />
      </Suspense>

      <p className="mt-4 text-sm text-zinc-500">
        {firms.length} firm{firms.length !== 1 ? "s" : ""} · sorted by{" "}
        <span className="font-medium text-zinc-700">{sortLabel(sort)}</span>
      </p>

      <div className="mt-6">
        <FirmsRankingTable firms={firms} sort={sort} />
      </div>

      {firms.length === 0 && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="font-medium text-zinc-800">No firms match your filters</p>
          <Link href="/firms" className="mt-4 inline-block text-sm text-amber-700 underline">
            Clear all filters
          </Link>
        </div>
      )}
    </main>
  );
}
