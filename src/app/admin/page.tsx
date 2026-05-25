import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminReviewActions } from "@/components/admin/review-actions";

export default async function AdminDashboardPage() {
  const [
    firmCount,
    publishedFirms,
    postCount,
    publishedPosts,
    pendingCount,
    approvedCount,
    userCount,
    pendingReviews,
    clicksLast7,
  ] = await Promise.all([
    prisma.propFirm.count(),
    prisma.propFirm.count({ where: { published: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
    prisma.review.findMany({
      where: { status: "PENDING" },
      take: 5,
      include: {
        user: { select: { email: true, name: true } },
        firm: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.affiliateClick.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return (
    <>
      <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Overview of your prop firm comparison platform.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Prop firms" value={firmCount} sub={`${publishedFirms} published`} href="/admin/firms" />
        <StatCard label="Blog posts" value={postCount} sub={`${publishedPosts} published`} href="/admin/blog" />
        <StatCard label="Pending reviews" value={pendingCount} href="/admin/reviews?status=PENDING" highlight={pendingCount > 0} />
        <StatCard label="Approved reviews" value={approvedCount} href="/admin/reviews?status=APPROVED" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Registered users" value={userCount} href="/admin/users" />
        <StatCard
          label="Affiliate clicks (7d)"
          value={clicksLast7}
          href="/admin/analytics"
        />
      </div>

      <section className="mt-12 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900">Recent pending reviews</h3>
          <Link href="/admin/reviews" className="text-sm text-amber-700 hover:underline">
            View all →
          </Link>
        </div>
        {pendingReviews.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No reviews waiting for approval.</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100">
            {pendingReviews.map((review) => (
              <li key={review.id} className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0">
                <div>
                  <p className="font-medium">
                    <Link href={`/firms/${review.firm.slug}`} className="hover:underline">
                      {review.firm.name}
                    </Link>
                    {" — "}
                    {"★".repeat(review.rating)}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {review.user.name ?? review.user.email}
                  </p>
                  {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{review.body}</p>
                </div>
                <AdminReviewActions reviewId={review.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <QuickLink href="/admin/firms/new" label="+ Add firm" />
        <QuickLink href="/admin/blog/new" label="+ New blog post" />
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  href,
  highlight,
}: {
  label: string;
  value: number;
  sub?: string;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div
      className={`rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${
        highlight ? "border-amber-300 ring-1 ring-amber-200" : "border-zinc-200"
      }`}
    >
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
      <p className="text-sm font-medium text-zinc-600">{label}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
    >
      {label}
    </Link>
  );
}
