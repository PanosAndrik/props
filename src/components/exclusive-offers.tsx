import Link from "next/link";
import type { PropFirm } from "@prisma/client";
import { OfferDealCard } from "@/components/offer-deal-card";
import { avgRating } from "@/lib/firm-utils";

type FirmOffer = PropFirm & { reviews: { rating: number }[] };

export function ExclusiveOffers({
  firms,
  title,
  subtitle,
}: {
  firms: FirmOffer[];
  title: string;
  subtitle?: string | null;
}) {
  if (firms.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-4 sm:py-6">
      <div className="mb-3 flex flex-col gap-1 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
        <div>
          <h2 className="text-base font-bold text-zinc-900 sm:text-xl">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-zinc-600 sm:mt-1 sm:text-sm">{subtitle}</p>
          )}
        </div>
        <Link
          href="/deals"
          className="text-xs font-medium text-amber-700 hover:underline sm:text-sm"
        >
          View all offers →
        </Link>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {firms.map((firm, i) => (
          <OfferDealCard
            key={firm.id}
            firm={firm}
            index={i}
            rating={avgRating(firm.reviews)}
            source="offers-home"
          />
        ))}
      </div>
    </section>
  );
}
