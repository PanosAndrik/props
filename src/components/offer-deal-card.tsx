"use client";

import Link from "next/link";
import { FirmLogo } from "@/components/firm-logo";
import { offerColorClasses } from "@/lib/blog-meta";
import { affiliateOutUrl, type AffiliateSource } from "@/lib/affiliate-out";
import { CopyCouponButton } from "@/components/copy-coupon-button";

type OfferFirm = {
  slug: string;
  name: string;
  logoUrl: string | null;
  brandColor: string | null;
  discountCode: string | null;
  discountPercent: number | null;
  affiliateUrl: string | null;
  websiteUrl: string | null;
};

export function OfferDealCard({
  firm,
  index,
  rating,
  source,
}: {
  firm: OfferFirm;
  index: number;
  rating: number | null;
  source: AffiliateSource;
}) {
  const colors = offerColorClasses(firm.brandColor, index);
  const hasOutbound = !!(firm.affiliateUrl?.trim() || firm.websiteUrl?.trim());
  const dealHref = hasOutbound
    ? affiliateOutUrl(firm.slug, source)
    : `/firms/${firm.slug}`;
  const code = firm.discountCode?.trim();

  return (
    <div className={`flex flex-col rounded-lg border-2 bg-white sm:rounded-xl ${colors.border}`}>
      <div className="flex items-center gap-2 border-b border-zinc-100 px-2.5 py-2 sm:p-3">
        <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <Link href={`/firms/${firm.slug}`} className="truncate text-sm font-semibold leading-tight hover:underline">
            {firm.name}
          </Link>
          {rating !== null && (
            <p className="text-[11px] text-amber-700 sm:text-xs">★ {rating.toFixed(1)}</p>
          )}
        </div>
        {firm.discountPercent != null && (
          <p className="shrink-0 text-base font-bold sm:hidden">{firm.discountPercent}%</p>
        )}
      </div>
      <div className={`flex flex-1 flex-col px-2.5 py-2 sm:p-3 ${colors.bg}`}>
        {firm.discountPercent != null && (
          <p className="hidden text-xl font-bold sm:block">{firm.discountPercent}% OFF</p>
        )}
        {code && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:mt-2">
            <p
              className={`rounded border border-dashed border-zinc-400 bg-white px-2 py-1 font-mono text-[11px] font-bold sm:text-xs ${colors.code}`}
            >
              {code}
            </p>
            <CopyCouponButton code={code} compact />
          </div>
        )}
        <div className="mt-2 sm:mt-3">
          {hasOutbound ? (
            <a
              href={dealHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-md py-1.5 text-center text-xs font-medium text-white sm:rounded-lg sm:py-2 sm:text-sm ${colors.btn}`}
            >
              Get deal →
            </a>
          ) : (
            <Link
              href={dealHref}
              className={`block rounded-md py-1.5 text-center text-xs font-medium text-white sm:rounded-lg sm:py-2 sm:text-sm ${colors.btn}`}
            >
              Get deal →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
