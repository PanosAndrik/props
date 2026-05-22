import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BlogCoverImage } from "@/components/blog-cover-image";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-zinc-600">Guides, reviews, and prop firm news.</p>

      <ul className="mt-8 space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="flex gap-4 overflow-hidden rounded-xl border border-zinc-200 bg-white hover:border-zinc-300"
            >
              {post.coverImage && (
                <div className="hidden h-28 w-40 shrink-0 overflow-hidden sm:block">
                  <BlogCoverImage
                    src={post.coverImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-5">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-zinc-500">No posts yet.</p>
        )}
      </ul>
    </main>
  );
}
