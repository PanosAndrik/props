import Link from "next/link";
import type { PropFirm } from "@prisma/client";
import { FirmLogo } from "@/components/firm-logo";
import { offerColorClasses } from "@/lib/blog-meta";
import { avgRating } from "@/lib/firm-utils";

type FeaturedFirm = PropFirm & { reviews: { rating: number }[] };

export function FeaturedFirmCards({ firms }: { firms: FeaturedFirm[] }) {
  if (firms.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-xl">Featured firms</h2>
        <Link href="/firms" className="text-sm font-medium text-amber-700 hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {firms.map((firm, i) => {
          const rating = avgRating(firm.reviews);
          const colors = offerColorClasses(firm.brandColor, i);
          return (
            <div
              key={firm.id}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 border-b border-zinc-100 p-4">
                <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size="sm" />
                <div>
                  <p className="font-semibold">{firm.name}</p>
                  {rating !== null && (
                    <p className="text-sm text-amber-700">★ {rating.toFixed(1)}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-3 text-sm text-zinc-600">
                  {firm.description}
                </p>
                <p className="mt-3 text-sm font-medium text-zinc-800">
                  {firm.maxAllocation && (
                    <span>Alloc: {firm.maxAllocation} </span>
                  )}
                  {firm.profitSplit && <span>· Split: {firm.profitSplit}</span>}
                </p>
                {(firm.discountCode || firm.discountPercent) && (
                  <p
                    className={`mt-3 rounded border border-dashed px-3 py-2 text-center text-sm font-bold ${colors.border} ${colors.code} ${colors.bg}`}
                  >
                    {firm.discountCode}
                    {firm.discountCode && firm.discountPercent ? " — " : ""}
                    {firm.discountPercent != null ? `${firm.discountPercent}% OFF` : ""}
                  </p>
                )}
                <Link
                  href={`/firms/${firm.slug}`}
                  className="mt-4 block rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-700"
                >
                  View firm →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
