import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogPostGrid } from "@/components/blog-post-grid";
import { BlogCategoryPills } from "@/components/blog-category-pills";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Blog — Guides & Comparisons | PropCompare",
  description: "Prop firm guides, comparisons, deals roundups, and trader news.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <h1 className="text-2xl font-bold sm:text-3xl">Blog</h1>
      <p className="mt-2 text-zinc-600">
        Guides, comparisons, and prop firm news.
      </p>

      <div className="mt-6">
        <BlogCategoryPills active={category} />
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        {posts.length} post{posts.length !== 1 ? "s" : ""}
        {category ? ` in ${category}` : ""}
      </p>

      <div className="mt-6">
        <BlogPostGrid posts={posts} />
      </div>
    </main>
  );
}
