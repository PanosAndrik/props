import type { BlogPost } from "@prisma/client";
import { BlogPostGrid } from "@/components/blog-post-grid";

export function RelatedBlogPosts({
  posts,
  category,
}: {
  posts: BlogPost[];
  category?: string | null;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto mt-12 w-full max-w-6xl border-t border-zinc-200 pt-10">
      <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">Related articles</h2>
      <p className="mt-1 text-sm text-zinc-600">
        {category ? `More in ${category}.` : "Continue reading on the blog."}
      </p>
      <div className="mt-6">
        <BlogPostGrid posts={posts} />
      </div>
    </section>
  );
}
