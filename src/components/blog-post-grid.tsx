import Link from "next/link";
import type { BlogPost } from "@prisma/client";
import { BlogCoverImage } from "@/components/blog-cover-image";
import { BlogCategoryBadge } from "@/components/blog-category-badge";

export function BlogPostGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="text-caption">No posts yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-sm"
        >
          {post.coverImage ? (
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-zinc-100 bg-zinc-50">
              <BlogCoverImage
                src={post.coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="flex flex-1 flex-col p-4">
            {post.category && (
              <BlogCategoryBadge category={post.category} className="mb-2" />
            )}
            <h3 className="subsection-title line-clamp-2">{post.title}</h3>
            {post.excerpt && (
              <p className="mt-2 flex-1 text-body-sm line-clamp-3">{post.excerpt}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              {post.readTimeMinutes != null && (
                <span>{post.readTimeMinutes} min read</span>
              )}
              {post.difficulty && (
                <>
                  <span>·</span>
                  <span>{post.difficulty}</span>
                </>
              )}
              <span className="ml-auto font-medium text-amber-700">Read more →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
