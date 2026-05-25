import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [firms, posts] = await Promise.all([
    prisma.propFirm.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/firms",
    "/compare",
    "/deals",
    "/reviews",
    "/blog",
    "/about",
    "/privacy",
    "/terms",
    "/disclosure",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const firmRoutes = firms.map((f) => ({
    url: `${base}/firms/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...firmRoutes, ...blogRoutes];
}
