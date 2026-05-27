import Link from "next/link";
import { FirmLogo } from "@/components/firm-logo";
import type { FirmSortKey, FirmWithReviews } from "@/lib/firm-sort";
import { avgRating, parseList } from "@/lib/firm-utils";
import { CopyCouponButton } from "@/components/copy-coupon-button";

export function FirmsRankingMobileCards({
  firms,
  sort = "rank",
}: {
  firms: FirmWithReviews[];
  sort?: FirmSortKey;
}) {
  return (
    <ul className="space-y-3 md:hidden">
      {firms.map((firm, index) => {
        const rating = avgRating(firm.reviews);
        const assets = parseList(firm.assetTypes);
        const position = sort === "rank" ? firm.rankOrder : index + 1;

        return (
          <li
            key={firm.id}
            className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  position <= 3 ? "bg-amber-100 text-amber-800" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {position}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/firms/${firm.slug}`} className="flex items-center gap-2">
                  <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size="sm" />
                  <div className="min-w-0">
                    <p className="subsection-title truncate">
                      {firm.name}
                      {firm.isNew && (
                        <span className="ml-1 pill-badge bg-emerald-100 text-emerald-800">
                          New
                        </span>
                      )}
                    </p>
                    <p className="text-xs capitalize text-zinc-500">{firm.category}</p>
                  </div>
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {rating !== null ? (
                    <span className="font-medium text-amber-700">
                      ★ {rating.toFixed(1)} ({firm.reviews.length})
                    </span>
                  ) : (
                    <span className="text-zinc-400">No reviews</span>
                  )}
                  {firm.maxAllocation && (
                    <span className="text-zinc-600">· {firm.maxAllocation}</span>
                  )}
                </div>
                {assets.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {assets.slice(0, 3).map((a) => (
                      <span
                        key={a}
                        className="pill-badge bg-zinc-100 text-zinc-600"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
                {(firm.discountCode || firm.discountPercent) && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {firm.discountPercent != null && (
                      <span className="text-sm font-bold text-emerald-700">
                        {firm.discountPercent}% OFF
                      </span>
                    )}
                    {firm.discountCode && (
                      <CopyCouponButton code={firm.discountCode} compact />
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
