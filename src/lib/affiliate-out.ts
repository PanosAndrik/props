/** Where the outbound affiliate link was shown (for analytics). */
export const AFFILIATE_SOURCES = [
  "firm-page",
  "firm-sticky",
  "firm-offer",
  "firm-buy",
  "firm-bottom-cta",
  "deals",
  "offers-home",
  "compare",
] as const;

export type AffiliateSource = (typeof AFFILIATE_SOURCES)[number];

export function isAffiliateSource(value: string): value is AffiliateSource {
  return (AFFILIATE_SOURCES as readonly string[]).includes(value);
}

/** Tracked redirect — logs click server-side then redirects to affiliate URL. */
export function affiliateOutUrl(slug: string, source: AffiliateSource) {
  return `/out/${slug}?src=${encodeURIComponent(source)}`;
}
