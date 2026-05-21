import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
              className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-300"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              {post.excerpt && (
                <p className="mt-2 text-sm text-zinc-600">{post.excerpt}</p>
              )}
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
