import { CopyCouponButton } from "./copy-coupon-button";
import { affiliateOutUrl } from "@/lib/affiliate-out";

type Props = {
  slug: string;
  firmName: string;
  discountCode?: string | null;
  discountPercent?: number | null;
  affiliateUrl?: string | null;
  websiteUrl?: string | null;
};

export function FirmOfferCard({
  slug,
  firmName,
  discountCode,
  discountPercent,
  affiliateUrl,
  websiteUrl,
}: Props) {
  const code = discountCode?.trim();
  const hasOutbound = !!(affiliateUrl?.trim() || websiteUrl?.trim());
  const visitHref = hasOutbound ? affiliateOutUrl(slug, "firm-offer") : null;

  if (!code && !visitHref && !discountPercent) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-zinc-300 bg-gradient-to-br from-zinc-50 to-white text-zinc-900 shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-900 px-5 py-3">
        <p className="text-sm font-semibold text-white">
          Ready to try {firmName}?
        </p>
        {code && (
          <p className="mt-0.5 text-xs text-zinc-300">
            Use our exclusive coupon below when you sign up
          </p>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        {code || discountPercent ? (
          <div className="flex-1">
            {discountPercent ? (
              <p className="section-title text-emerald-700">{discountPercent}% OFF</p>
            ) : null}
            <p className="text-label">
              Coupon code
            </p>
            {code ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="coupon-code inline-block rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 px-4 py-2 text-zinc-900">
                  {code}
                </span>
                <CopyCouponButton code={code} />
              </div>
            ) : null}
          </div>
        ) : (
          <p className="flex-1 text-body-sm">
            Visit the official site to get started with {firmName}.
          </p>
        )}

        {visitHref && (
          <a
            href={visitHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
          >
            Visit {firmName} →
          </a>
        )}
      </div>
    </div>
  );
}
