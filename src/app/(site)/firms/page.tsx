import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { FirmFilters } from "@/components/firm-filters";

type Props = { searchParams: Promise<{ q?: string; asset?: string; featured?: string }> };

export default async function FirmsPage({ searchParams }: Props) {
  const { q, asset, featured } = await searchParams;

  const firms = await prisma.propFirm.findMany({
    where: {
      published: true,
      ...(featured === "1" ? { featured: true } : {}),
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
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    include: {
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
  });

  const allAssets = await prisma.propFirm.findMany({
    where: { published: true },
    select: { assetTypes: true },
  });
  const assetOptions = [
    ...new Set(
      allAssets.flatMap((f) => f.assetTypes.split(",").map((a) => a.trim()))
    ),
  ].filter(Boolean).sort();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Prop firms</h1>
          <p className="mt-2 text-zinc-600">
            Compare rules, fees, and trader reviews.
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
        <FirmFilters assetOptions={assetOptions} />
      </Suspense>

      <p className="mt-4 text-sm text-zinc-500">
        {firms.length} firm{firms.length !== 1 ? "s" : ""} found
      </p>

      <ul className="mt-6 space-y-4">
        {firms.map((firm) => {
          const ratings = firm.reviews.map((r) => r.rating);
          const avg =
            ratings.length > 0
              ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
              : null;

          return (
            <li key={firm.id}>
              <Link
                href={`/firms/${firm.slug}`}
                className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {firm.name}
                      {firm.featured && (
                        <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                          Featured
                        </span>
                      )}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                      {firm.description}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {firm.assetTypes} · Split {firm.profitSplit ?? "—"} · From $
                      {firm.minFee ?? "—"}
                      {firm.discountCode && (
                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 font-mono font-semibold text-amber-900">
                          {firm.discountCode}
                        </span>
                      )}
                    </p>
                  </div>
                  {avg && (
                    <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
                      ★ {avg}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

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
