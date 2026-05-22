import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [firmCount, reviewCount, postCount, featured, latestReviews, latestPosts, allFirms] =
    await Promise.all([
      prisma.propFirm.count({ where: { published: true } }),
      prisma.review.count({ where: { status: "APPROVED" } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.propFirm.findMany({
        where: { published: true, featured: true },
        take: 3,
        orderBy: { name: "asc" },
      }),
      prisma.review.findMany({
        where: { status: "APPROVED" },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          firm: { select: { name: true, slug: true } },
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        take: 3,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.propFirm.findMany({
        where: { published: true },
        include: {
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
        },
      }),
    ]);

  const topRated = allFirms
    .map((firm) => {
      const ratings = firm.reviews.map((r) => r.rating);
      if (ratings.length === 0) return null;
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      return { ...firm, avg, reviewCount: ratings.length };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  return (
    <main>
      <section className="border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-amber-700">
            Prop firm comparison platform
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find & compare trusted prop firms
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
            Real trader reviews, exclusive coupon codes, and side-by-side comparisons.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/firms"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Browse firms
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium hover:bg-zinc-100"
            >
              Compare firms
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium hover:bg-zinc-100"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-12 sm:grid-cols-3">
        <Stat label="Prop firms" value={firmCount} />
        <Stat label="Approved reviews" value={reviewCount} />
        <Stat label="Blog posts" value={postCount} />
      </section>

      {topRated.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Top rated firms</h2>
            <Link href="/firms" className="text-sm text-amber-700 hover:underline">
              View all →
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {topRated.map((firm, i) => (
              <li key={firm.id}>
                <Link
                  href={`/firms/${firm.slug}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300"
                >
                  <span className="font-medium">
                    <span className="mr-2 text-zinc-400">{i + 1}.</span>
                    {firm.name}
                    {firm.discountCode && (
                      <span className="ml-2 font-mono text-xs text-amber-800">
                        {firm.discountCode}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-medium text-amber-700">
                    ★ {firm.avg.toFixed(1)} ({firm.reviewCount})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-12">
          <h2 className="mb-4 text-xl font-semibold">Featured firms</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((firm) => (
              <Link
                key={firm.id}
                href={`/firms/${firm.slug}`}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
              >
                <h3 className="font-semibold">{firm.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                  {firm.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {latestReviews.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-12">
          <h2 className="text-xl font-semibold">Latest reviews</h2>
          <ul className="mt-4 space-y-3">
            {latestReviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <Link
                    href={`/firms/${review.firm.slug}`}
                    className="font-medium hover:underline"
                  >
                    {review.firm.name}
                  </Link>
                  <span className="text-amber-700">{"★".repeat(review.rating)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{review.body}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {review.user.name ?? review.user.email}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">From the blog</h2>
            <Link href="/blog" className="text-sm text-amber-700 hover:underline">
              All posts →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300"
                >
                  <h3 className="font-medium">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-600">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}
