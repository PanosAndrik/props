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
    <section className="mx-auto mt-14 w-full max-w-6xl border-t border-zinc-200 pt-10 sm:mt-16 sm:pt-12">
      <h2 className="section-title">Related articles</h2>
      <p className="mt-1 text-body-sm">
        {category ? `More in ${category}.` : "Continue reading on the blog."}
      </p>
      <div className="mt-6 sm:mt-8">
        <BlogPostGrid posts={posts} />
      </div>
    </section>
  );
}
