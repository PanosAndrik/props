import { CopyCouponButton } from "./copy-coupon-button";

type Props = {
  firmName: string;
  discountCode?: string | null;
  affiliateUrl?: string | null;
  websiteUrl?: string | null;
};

export function FirmOfferCard({
  firmName,
  discountCode,
  affiliateUrl,
  websiteUrl,
}: Props) {
  const code = discountCode?.trim();
  const visitUrl = (affiliateUrl?.trim() || websiteUrl?.trim()) ?? null;

  if (!code && !visitUrl) return null;

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
        {code ? (
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Coupon code
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-block rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 px-4 py-2 font-mono text-2xl font-bold tracking-wider text-zinc-900">
                {code}
              </span>
              <CopyCouponButton code={code} />
            </div>
          </div>
        ) : (
          <p className="flex-1 text-sm text-zinc-600">
            Visit the official site to get started with {firmName}.
          </p>
        )}

        {visitUrl && (
          <a
            href={visitUrl}
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
