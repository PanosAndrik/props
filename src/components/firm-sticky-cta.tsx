"use client";

import { CopyCouponButton } from "@/components/copy-coupon-button";
import { affiliateOutUrl } from "@/lib/affiliate-out";

export function FirmStickyCta({
  slug,
  firmName,
  discountCode,
  discountPercent,
  hasOutbound,
}: {
  slug: string;
  firmName: string;
  discountCode?: string | null;
  discountPercent?: number | null;
  hasOutbound?: boolean;
}) {
  const code = discountCode?.trim();
  const visitHref = hasOutbound ? affiliateOutUrl(slug, "firm-sticky") : null;

  if (!code && !visitHref && !discountPercent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <div className="min-w-0 flex-1">
          {discountPercent != null && (
            <p className="text-xs font-bold text-emerald-700">{discountPercent}% OFF</p>
          )}
          {code ? (
            <p className="truncate font-mono text-sm font-bold text-zinc-900">{code}</p>
          ) : (
            <p className="truncate text-xs text-zinc-600">{firmName}</p>
          )}
        </div>
        {code && <CopyCouponButton code={code} compact />}
        {visitHref && (
          <a
            href={visitHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white"
          >
            Visit →
          </a>
        )}
      </div>
    </div>
  );
}
