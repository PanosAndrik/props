import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { OfferDealCard } from "@/components/offer-deal-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { avgRating } from "@/lib/firm-utils";

export const metadata: Metadata = {
  title: "Exclusive Deals & Coupon Codes | PropCompare",
  description: "Copy exclusive prop firm discount codes and save at checkout.",
};

export default async function DealsPage() {
  const firms = await prisma.propFirm.findMany({
    where: {
      published: true,
      OR: [{ discountCode: { not: null } }, { discountPercent: { not: null } }],
    },
    include: {
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    orderBy: [{ showInOffers: "desc" }, { rankOrder: "asc" }],
  });

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Deals" }]} />
      <h1 className="page-title">Exclusive deals</h1>
      <p className="mt-2 text-muted">
        Copy discount codes and save at checkout on prop firms.
      </p>

      {firms.length === 0 ? (
        <div className="mt-12 rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="font-medium text-zinc-800">No deals published yet</p>
          <p className="mt-2 text-caption">Check back soon or browse all firms.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {firms.map((firm, i) => (
            <OfferDealCard
              key={firm.id}
              firm={firm}
              index={i}
              rating={avgRating(firm.reviews)}
              source="deals"
            />
          ))}
        </div>
      )}
    </main>
  );
}
