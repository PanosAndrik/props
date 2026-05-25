import Link from "next/link";
import type { BlogPost } from "@prisma/client";
import { BlogPostGrid } from "@/components/blog-post-grid";

export function HomeBlogGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-xl">From the blog</h2>
        <Link href="/blog" className="text-sm font-medium text-amber-700 hover:underline">
          All posts →
        </Link>
      </div>
      <BlogPostGrid posts={posts} />
    </section>
  );
}
