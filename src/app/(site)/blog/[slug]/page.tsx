import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogCoverImage } from "@/components/blog-cover-image";
import { BlogMarkdown } from "@/components/blog-markdown";
import { RelatedBlogPosts } from "@/components/related-blog-posts";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { categoryStyle } from "@/lib/blog-meta";
import { getRelatedBlogPosts } from "@/lib/related-blog-posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, published: true },
  });
  if (!post || !post.published) return { title: "Blog | PropCompare" };
  return {
    title: `${post.title} | PropCompare Blog`,
    description: post.excerpt ?? undefined,
  };
}

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

  const relatedPosts = await getRelatedBlogPosts(post);
  const publishedDate = post.publishedAt ?? post.createdAt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedDate.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  return (
    <main className="mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        {!post.published && isAdmin && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Draft preview</strong> — This post is not published yet. Check
            &quot;Published&quot; in admin and save to show it to everyone.
          </p>
        )}

        <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <time dateTime={publishedDate.toISOString()}>
            {publishedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          {post.category && (
            <>
              <span>·</span>
              <span
                className={`rounded border px-2 py-0.5 text-xs font-semibold ${categoryStyle(post.category)}`}
              >
                {post.category}
              </span>
            </>
          )}
          {post.readTimeMinutes != null && (
            <>
              <span>·</span>
              <span>{post.readTimeMinutes} min read</span>
            </>
          )}
          {post.difficulty && (
            <>
              <span>·</span>
              <span>{post.difficulty}</span>
            </>
          )}
        </div>
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
        <BlogMarkdown content={post.content} />
      </div>

      <RelatedBlogPosts posts={relatedPosts} category={post.category} />
    </main>
  );
}
