import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewsFilters } from "@/components/reviews-filters";

export const metadata: Metadata = {
  title: "Trader Reviews | PropCompare",
  description: "Read verified trader reviews on prop firms.",
};

const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ firm?: string; rating?: string; page?: string }>;
};

export default async function ReviewsPage({ searchParams }: Props) {
  const { firm: firmSlug, rating: ratingParam, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const rating = ratingParam ? parseInt(ratingParam, 10) : null;

  const where = {
    status: "APPROVED" as const,
    ...(firmSlug ? { firm: { slug: firmSlug } } : {}),
    ...(rating && rating >= 1 && rating <= 5 ? { rating } : {}),
  };

  const [reviews, total, firmOptions] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        firm: { select: { name: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.review.count({ where }),
    prisma.propFirm.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (firmSlug) params.set("firm", firmSlug);
    if (ratingParam) params.set("rating", ratingParam);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/reviews?${qs}` : "/reviews";
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl px-4 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />
      <h1 className="text-2xl font-bold sm:text-3xl">Trader reviews</h1>
      <p className="mt-2 text-zinc-600">
        Verified reviews from traders on prop firms.
      </p>

      <Suspense fallback={<div className="mt-6 h-10 animate-pulse rounded-lg bg-zinc-100" />}>
        <ReviewsFilters firms={firmOptions} />
      </Suspense>

      <p className="mt-4 text-sm text-zinc-500">
        {total} review{total !== 1 ? "s" : ""}
        {firmSlug || ratingParam ? " (filtered)" : ""}
      </p>

      {reviews.length === 0 ? (
        <div className="mt-12 rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="font-medium text-zinc-800">No reviews match your filters</p>
          <p className="mt-2 text-sm text-zinc-500">
            Be the first to share your experience on a firm page.
          </p>
          <Link
            href="/firms"
            className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Browse firms →
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 px-4 py-3 text-sm">
                <Link
                  href={`/firms/${review.firm.slug}`}
                  className="font-semibold text-zinc-900 hover:underline"
                >
                  {review.firm.name}
                </Link>
                <span className="text-zinc-500">
                  {review.user.name ?? review.user.email.split("@")[0]}
                </span>
                <span className="font-medium text-amber-700">
                  {"★".repeat(review.rating)}
                  <span className="ml-1 text-zinc-600">{review.rating}.0</span>
                </span>
              </div>
              <div className="px-4 py-4">
                <p className="text-xs text-zinc-400">
                  {review.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                {review.title && (
                  <p className="mt-2 font-medium text-zinc-900">{review.title}</p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  &ldquo;{review.body}&rdquo;
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
          {page > 1 && (
            <Link
              href={pageHref(page - 1)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              ← Prev
            </Link>
          )}
          <span className="text-sm text-zinc-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={pageHref(page + 1)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
