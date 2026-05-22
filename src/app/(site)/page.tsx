import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FirmsRankingTable } from "@/components/firms-ranking-table";
import { sortFirms } from "@/lib/firm-sort";

export default async function Home() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const [rankedFirms, featured, latestReviews, latestPosts, adminStats] =
    await Promise.all([
      prisma.propFirm
        .findMany({
          where: { published: true },
          include: {
            reviews: { where: { status: "APPROVED" }, select: { rating: true } },
          },
        })
        .then((firms) => sortFirms(firms, "rank").slice(0, 10)),
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
      isAdmin
        ? Promise.all([
            prisma.propFirm.count({ where: { published: true } }),
            prisma.review.count({ where: { status: "APPROVED" } }),
            prisma.review.count({ where: { status: "PENDING" } }),
            prisma.blogPost.count({ where: { published: true } }),
            prisma.user.count(),
          ])
        : null,
    ]);

  const [firmCount, reviewCount, pendingReviews, postCount, userCount] =
    adminStats ?? [0, 0, 0, 0, 0];

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
            {isAdmin
              ? "Manage firms, moderate reviews, and publish content from the admin panel."
              : session
                ? `Welcome back${session.user?.name ? `, ${session.user.name}` : ""}. Compare firms, use coupon codes, and share your experience.`
                : "Real trader reviews, exclusive coupon codes, and side-by-side comparisons."}
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
            {isAdmin ? (
              <Link
                href="/admin"
                className="rounded-full border border-amber-300 bg-amber-50 px-6 py-3 text-sm font-medium text-amber-900 hover:bg-amber-100"
              >
                Admin panel
              </Link>
            ) : session ? (
              <Link
                href="/account"
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium hover:bg-zinc-100"
              >
                My account
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium hover:bg-zinc-100"
              >
                Create account
              </Link>
            )}
          </div>
        </div>
      </section>

      {isAdmin && adminStats && (
        <section className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Platform overview
            </h2>
            <Link href="/admin" className="text-sm text-amber-700 hover:underline">
              Open admin →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <AdminStat label="Published firms" value={firmCount} href="/admin/firms" />
            <AdminStat label="Approved reviews" value={reviewCount} href="/admin/reviews?status=APPROVED" />
            <AdminStat
              label="Pending reviews"
              value={pendingReviews}
              href="/admin/reviews?status=PENDING"
              highlight={pendingReviews > 0}
            />
            <AdminStat label="Blog posts" value={postCount} href="/admin/blog" />
            <AdminStat label="Users" value={userCount} href="/admin/users" />
          </div>
        </section>
      )}

      {rankedFirms.length > 0 && (
        <section className={`mx-auto max-w-6xl px-4 pb-12 ${isAdmin ? "" : "pt-12"}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Prop firm rankings</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link href="/firms?sort=rating" className="text-amber-700 hover:underline">
                By rating
              </Link>
              <span className="text-zinc-300">·</span>
              <Link href="/firms?sort=allocation" className="text-amber-700 hover:underline">
                By allocation
              </Link>
              <span className="text-zinc-300">·</span>
              <Link href="/firms?sort=fee" className="text-amber-700 hover:underline">
                By fee
              </Link>
              <span className="text-zinc-300">·</span>
              <Link href="/firms" className="font-medium text-zinc-700 hover:underline">
                Full table →
              </Link>
            </div>
          </div>
          <FirmsRankingTable firms={rankedFirms} sort="rank" />
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

function AdminStat({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border bg-white p-5 text-center transition hover:shadow-md ${
        highlight ? "border-amber-300 ring-1 ring-amber-200" : "border-zinc-200"
      }`}
    >
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-zinc-500">{label}</p>
    </Link>
  );
}
