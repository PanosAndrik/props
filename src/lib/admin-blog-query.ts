import type { Prisma } from "@prisma/client";

export type AdminBlogFilters = {
  q?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  sort?: string;
  from?: string;
  to?: string;
};

export function buildAdminBlogWhere(filters: AdminBlogFilters): Prisma.BlogPostWhereInput {
  const fromDate = filters.from ? new Date(`${filters.from}T00:00:00`) : undefined;
  const toDate = filters.to ? new Date(`${filters.to}T23:59:59.999`) : undefined;

  return {
    ...(filters.status === "published" ? { published: true } : {}),
    ...(filters.status === "draft" ? { published: false } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q } },
            { slug: { contains: filters.q } },
            { excerpt: { contains: filters.q } },
          ],
        }
      : {}),
    ...(fromDate || toDate
      ? {
          updatedAt: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          },
        }
      : {}),
  };
}

export function buildAdminBlogOrderBy(
  sort?: string
): Prisma.BlogPostOrderByWithRelationInput {
  switch (sort) {
    case "updated_asc":
      return { updatedAt: "asc" };
    case "published_desc":
      return { publishedAt: "desc" };
    case "published_asc":
      return { publishedAt: "asc" };
    case "title_asc":
      return { title: "asc" };
    case "updated_desc":
    default:
      return { updatedAt: "desc" };
  }
}
