import type { Prisma } from "@prisma/client";

export type FirmListFilters = {
  q?: string;
  asset?: string;
  featured?: string;
  category?: string;
  coupon?: string;
  maxFee?: string;
  instant?: string;
};

export function buildFirmWhere(filters: FirmListFilters): Prisma.PropFirmWhereInput {
  const maxFee = filters.maxFee ? parseInt(filters.maxFee, 10) : null;

  return {
    published: true,
    ...(filters.featured === "1" ? { featured: true } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.instant === "1" ? { instantFunded: true } : {}),
    ...(filters.coupon === "1"
      ? {
          OR: [
            { discountCode: { not: null } },
            { discountPercent: { not: null } },
          ],
        }
      : {}),
    ...(maxFee != null && !Number.isNaN(maxFee)
      ? {
          OR: [{ minFee: { lte: maxFee } }, { minFee: null }],
        }
      : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q } },
            { description: { contains: filters.q } },
          ],
        }
      : {}),
    ...(filters.asset ? { assetTypes: { contains: filters.asset } } : {}),
  };
}

export const firmIncludeReviews = {
  reviews: { where: { status: "APPROVED" as const }, select: { rating: true } },
} as const;
