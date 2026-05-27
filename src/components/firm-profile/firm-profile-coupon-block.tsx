"use client";

import { CopyCouponButton } from "@/components/copy-coupon-button";
import { AddToCompareButton } from "@/components/add-to-compare-button";
import { affiliateOutUrl } from "@/lib/affiliate-out";

type Props = {
  slug: string;
  firmName: string;
  discountCode?: string | null;
  discountPercent?: number | null;
  hasOutbound: boolean;
};

export function FirmProfileCouponBlock({
  slug,
  firmName,
  discountCode,
  discountPercent,
  hasOutbound,
}: Props) {
  const code = discountCode?.trim();
  if (!code && !hasOutbound) return null;

  const buyHref = hasOutbound ? affiliateOutUrl(slug, "firm-buy") : null;
  const visitHref = hasOutbound ? affiliateOutUrl(slug, "firm-page") : null;

  return (
    <section className="overflow-hidden rounded-xl bg-zinc-900 text-white">
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        {code && (
          <>
            <p className="text-label text-zinc-400">
              Your exclusive PropCompare coupon code
            </p>
            <p className="coupon-code mt-2 text-amber-300">{code}</p>
            <p className="mt-2 text-sm text-zinc-300">
              {discountPercent != null && `${discountPercent}% OFF · `}
              Click to copy · Paste at checkout on {firmName}
            </p>
            <div className="mt-3">
              <CopyCouponButton code={code} />
            </div>
          </>
        )}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {buyHref && (
            <a
              href={buyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Buy challenge — Use {code ?? "deal"}
            </a>
          )}
          {visitHref && (
            <a
              href={visitHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-lg border border-zinc-500 bg-transparent px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Visit website
            </a>
          )}
          <AddToCompareButton slug={slug} firmName={firmName} />
        </div>
      </div>
    </section>
  );
}
