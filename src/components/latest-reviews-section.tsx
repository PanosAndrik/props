import Link from "next/link";

type ReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  firm: { name: string; slug: string };
  user: { name: string | null; email: string };
};

export function LatestReviewsSection({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-xl">Latest reviews</h2>
        <Link href="/reviews" className="text-sm font-medium text-amber-700 hover:underline">
          All reviews →
        </Link>
      </div>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 px-4 py-3 text-sm">
              <Link
                href={`/firms/${review.firm.slug}`}
                className="font-semibold hover:underline"
              >
                {review.firm.name}
              </Link>
              <span className="text-zinc-500">
                {review.user.name ?? review.user.email.split("@")[0]}
              </span>
              <span className="text-amber-700">
                {"★".repeat(review.rating)}
                <span className="ml-1 text-zinc-600">{review.rating}.0</span>
              </span>
            </div>
            <div className="px-4 py-4">
              {review.title && (
                <p className="font-medium text-zinc-900">{review.title}</p>
              )}
              <p className="mt-1 text-sm leading-relaxed text-zinc-700 line-clamp-3">
                &ldquo;{review.body}&rdquo;
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
