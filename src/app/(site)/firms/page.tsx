import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { FirmFilters } from "@/components/firm-filters";
import { FirmsRankingTable } from "@/components/firms-ranking-table";
import { parseSortKey, sortFirms, sortLabel } from "@/lib/firm-sort";

type Props = {
  searchParams: Promise<{
    q?: string;
    asset?: string;
    featured?: string;
    category?: string;
    sort?: string;
  }>;
};

export default async function FirmsPage({ searchParams }: Props) {
  const { q, asset, featured, category, sort: sortParam } = await searchParams;
  const sort = parseSortKey(sortParam);

  const firmsRaw = await prisma.propFirm.findMany({
    where: {
      published: true,
      ...(featured === "1" ? { featured: true } : {}),
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
      ...(asset ? { assetTypes: { contains: asset } } : {}),
    },
    include: {
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Prop firm rankings</h1>
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

      <Suspense fallback={null}>
        <FirmFilters assetOptions={assetOptions} showCategory />
      </Suspense>

      <p className="mt-4 text-sm text-zinc-500">
        {firms.length} firm{firms.length !== 1 ? "s" : ""} · sorted by{" "}
        <span className="font-medium text-zinc-700">{sortLabel(sort)}</span>
        {sort === "rank" && (
          <span className="text-zinc-400">
            {" "}
            (set order in admin → Edit firm → Rank order)
          </span>
        )}
      </p>

      <div className="mt-6">
        <FirmsRankingTable firms={firms} sort={sort} />
      </div>

      {firms.length === 0 && (
        <p className="mt-8 text-center text-sm text-zinc-500">
          No firms match your filters.{" "}
          <Link href="/firms" className="text-amber-700 underline">
            Clear filters
          </Link>
        </p>
      )}
    </main>
  );
}
