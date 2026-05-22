import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogCoverImage } from "@/components/blog-cover-image";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) notFound();

  if (!post.published && !isAdmin) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Blog
      </Link>

      {!post.published && isAdmin && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Draft preview</strong> — This post is not published yet. Check
          &quot;Published&quot; in admin and save to show it to everyone.
        </p>
      )}

      <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
      {post.excerpt && (
        <p className="mt-3 text-lg text-zinc-600">{post.excerpt}</p>
      )}
      {post.coverImage ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
          <BlogCoverImage
            src={post.coverImage}
            alt={post.title}
            className="h-auto max-h-[420px] w-full object-cover"
          />
        </div>
      ) : null}
      <article className="prose prose-zinc mt-8 max-w-none whitespace-pre-wrap">
        {post.content}
      </article>
    </main>
  );
}
