import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminReviewActions } from "@/components/admin/review-actions";
import type { ReviewStatus } from "@prisma/client";

type Props = { searchParams: Promise<{ status?: string }> };

const filters: { label: string; value?: ReviewStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default async function AdminReviewsPage({ searchParams }: Props) {
  const { status: statusParam } = await searchParams;
  const status =
    statusParam === "PENDING" ||
    statusParam === "APPROVED" ||
    statusParam === "REJECTED"
      ? statusParam
      : undefined;

  const reviews = await prisma.review.findMany({
    where: status ? { status } : undefined,
    include: {
      user: { select: { email: true, name: true } },
      firm: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h2 className="page-title">Reviews</h2>
      <p className="mt-1 text-body-sm">
        Moderate user-submitted firm reviews.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const href = f.value ? `/admin/reviews?status=${f.value}` : "/admin/reviews";
          const active = (f.value ?? undefined) === status;
          return (
            <Link
              key={f.label}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                active
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-caption">No reviews in this filter.</p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={review.status} />
                    <span className="font-medium">
                      <Link href={`/firms/${review.firm.slug}`} className="hover:underline">
                        {review.firm.name}
                      </Link>
                      {" — "}
                      {"★".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="mt-1 text-caption">
                    {review.user.name ?? review.user.email} ·{" "}
                    {review.createdAt.toLocaleString()}
                  </p>
                </div>
                {review.status === "PENDING" && (
                  <AdminReviewActions reviewId={review.id} />
                )}
              </div>
              {review.title && <p className="mt-3 font-medium">{review.title}</p>}
              <p className="mt-1 text-sm text-zinc-700">{review.body}</p>
            </article>
          ))
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const styles: Record<ReviewStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
