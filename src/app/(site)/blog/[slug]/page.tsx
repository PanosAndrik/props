import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogCoverImage } from "@/components/blog-cover-image";
import { BlogMarkdown } from "@/components/blog-markdown";
import { BlogCategoryBadge } from "@/components/blog-category-badge";
import { RelatedBlogPosts } from "@/components/related-blog-posts";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
    <main className="mx-auto w-full min-w-0 px-4 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
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

        <header className="mt-6 border-b border-zinc-200 pb-8 sm:mt-8 sm:pb-10">
          <h1 className="article-title">{post.title}</h1>

          <div className="article-meta mt-4">
            <time dateTime={publishedDate.toISOString()}>
              {publishedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {post.category && <BlogCategoryBadge category={post.category} />}
            {post.readTimeMinutes != null && (
              <span>{post.readTimeMinutes} min read</span>
            )}
            {post.difficulty && <span>{post.difficulty}</span>}
          </div>

          {post.excerpt && (
            <p className="article-lead mt-5 max-w-2xl">{post.excerpt}</p>
          )}
        </header>

        {post.coverImage ? (
          <figure className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm sm:mt-10">
            <BlogCoverImage
              src={post.coverImage}
              alt={post.title}
              className="aspect-[16/10] w-full object-cover sm:aspect-[2/1]"
            />
          </figure>
        ) : null}

        <BlogMarkdown content={post.content} />

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:mt-12">
          <Link
            href="/blog"
            className="text-body-sm font-medium text-amber-800 hover:underline"
          >
            ← Back to blog
          </Link>
          {post.category && (
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="text-caption hover:text-zinc-800"
            >
              More in {post.category}
            </Link>
          )}
        </footer>
      </article>

      <RelatedBlogPosts posts={relatedPosts} category={post.category} />
    </main>
  );
}
