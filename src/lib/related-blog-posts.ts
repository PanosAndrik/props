import { prisma } from "@/lib/prisma";

export async function getRelatedBlogPosts(
  post: { id: string; category: string | null },
  limit = 3
) {
  const baseWhere = {
    published: true,
    id: { not: post.id },
  } as const;

  const sameCategory = post.category
    ? await prisma.blogPost.findMany({
        where: { ...baseWhere, category: post.category },
        orderBy: { publishedAt: "desc" },
        take: limit,
      })
    : [];

  if (sameCategory.length >= limit) {
    return sameCategory;
  }

  const excludeIds = [post.id, ...sameCategory.map((p) => p.id)];
  const more = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { notIn: excludeIds },
    },
    orderBy: { publishedAt: "desc" },
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...more];
}
