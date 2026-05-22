import type { PropFirm } from "@prisma/client";
import { avgRating } from "@/lib/firm-utils";

export type FirmSortKey = "rank" | "rating" | "allocation" | "fee";

export type FirmWithReviews = PropFirm & {
  reviews: { rating: number }[];
};

export const FIRM_SORT_OPTIONS: { value: FirmSortKey; label: string }[] = [
  { value: "rank", label: "Editorial rank" },
  { value: "rating", label: "Rating" },
  { value: "allocation", label: "Max allocation" },
  { value: "fee", label: "Lowest fee" },
];

export function parseSortKey(value: string | undefined): FirmSortKey {
  if (value === "rating" || value === "allocation" || value === "fee") return value;
  return "rank";
}

export function sortLabel(key: FirmSortKey): string {
  return FIRM_SORT_OPTIONS.find((o) => o.value === key)?.label ?? "Editorial rank";
}

/** Parse values like $200K, $1.5M, 300000 */
export function parseMoneyValue(value: string | null | undefined): number | null {
  if (!value?.trim()) return null;
  const cleaned = value.replace(/[,$\s]/gi, "").toUpperCase();
  const match = cleaned.match(/^([\d.]+)(K|M)?$/);
  if (!match) return null;
  let num = parseFloat(match[1]);
  if (Number.isNaN(num)) return null;
  if (match[2] === "K") num *= 1_000;
  if (match[2] === "M") num *= 1_000_000;
  return num;
}

export function sortFirms(firms: FirmWithReviews[], sort: FirmSortKey): FirmWithReviews[] {
  const list = [...firms];

  switch (sort) {
    case "rating":
      return list.sort((a, b) => {
        const ra = avgRating(a.reviews) ?? -1;
        const rb = avgRating(b.reviews) ?? -1;
        if (rb !== ra) return rb - ra;
        return a.rankOrder - b.rankOrder;
      });
    case "allocation":
      return list.sort((a, b) => {
        const aa = parseMoneyValue(a.maxAllocation) ?? -1;
        const ab = parseMoneyValue(b.maxAllocation) ?? -1;
        if (ab !== aa) return ab - aa;
        return a.rankOrder - b.rankOrder;
      });
    case "fee":
      return list.sort((a, b) => {
        const fa = a.minFee ?? Number.POSITIVE_INFINITY;
        const fb = b.minFee ?? Number.POSITIVE_INFINITY;
        if (fa !== fb) return fa - fb;
        return a.rankOrder - b.rankOrder;
      });
    case "rank":
    default:
      return list.sort(
        (a, b) => a.rankOrder - b.rankOrder || a.name.localeCompare(b.name)
      );
  }
}
