import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Blog
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
      <article className="prose prose-zinc mt-8 max-w-none whitespace-pre-wrap">
        {post.content}
      </article>
    </main>
  );
}
