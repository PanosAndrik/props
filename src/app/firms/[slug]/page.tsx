import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "./review-form";

type Props = { params: Promise<{ slug: string }> };

export default async function FirmDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const firm = await prisma.propFirm.findUnique({
    where: { slug, published: true },
    include: {
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!firm) notFound();

  const avgRating =
    firm.reviews.length > 0
      ? firm.reviews.reduce((s, r) => s + r.rating, 0) / firm.reviews.length
      : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/firms" className="text-sm text-zinc-500 hover:text-zinc-800">
        ← All firms
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{firm.name}</h1>
      {avgRating !== null && (
        <p className="mt-2 text-amber-700 font-medium">
          ★ {avgRating.toFixed(1)} · {firm.reviews.length} review
          {firm.reviews.length !== 1 ? "s" : ""}
        </p>
      )}

      <p className="mt-4 text-zinc-700">{firm.description}</p>

      <dl className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Assets</dt>
          <dd className="font-medium">{firm.assetTypes}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Profit split</dt>
          <dd className="font-medium">{firm.profitSplit ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Max drawdown</dt>
          <dd className="font-medium">{firm.maxDrawdown ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Min fee</dt>
          <dd className="font-medium">
            {firm.minFee != null ? `$${firm.minFee}` : "—"}
          </dd>
        </div>
      </dl>

      {firm.websiteUrl && (
        <a
          href={firm.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-medium text-amber-700 hover:underline"
        >
          Visit official site →
        </a>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Reviews</h2>

        {session ? (
          <ReviewForm firmId={firm.id} firmName={firm.name} />
        ) : (
          <p className="mt-4 rounded-lg bg-zinc-100 p-4 text-sm text-zinc-600">
            <Link href="/auth/signin" className="font-medium text-zinc-900 underline">
              Sign in
            </Link>{" "}
            to leave a review (pending admin approval).
          </p>
        )}

        <ul className="mt-6 space-y-4">
          {firm.reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-amber-700">
                  {"★".repeat(review.rating)}
                </span>
                <span className="text-xs text-zinc-500">
                  {review.user.name ?? review.user.email}
                </span>
              </div>
              {review.title && (
                <p className="mt-2 font-medium">{review.title}</p>
              )}
              <p className="mt-1 text-sm text-zinc-700">{review.body}</p>
            </li>
          ))}
          {firm.reviews.length === 0 && (
            <p className="text-sm text-zinc-500">No approved reviews yet.</p>
          )}
        </ul>
      </section>
    </main>
  );
}
