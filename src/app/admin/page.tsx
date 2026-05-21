import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminReviewActions } from "./review-actions";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const [pendingReviews, firms, posts] = await Promise.all([
    prisma.review.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { email: true, name: true } },
        firm: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.propFirm.count(),
    prisma.blogPost.count(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Admin panel</h1>
      <p className="mt-2 text-zinc-600">
        Approve reviews, manage content — more editing tools coming next.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card label="Prop firms" value={firms} />
        <Card label="Blog posts" value={posts} />
        <Card label="Pending reviews" value={pendingReviews.length} />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Pending reviews</h2>
        {pendingReviews.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No reviews waiting.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {pendingReviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {review.firm.name} — {"★".repeat(review.rating)}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {review.user.name ?? review.user.email}
                    </p>
                  </div>
                  <AdminReviewActions reviewId={review.id} />
                </div>
                {review.title && (
                  <p className="mt-2 font-medium">{review.title}</p>
                )}
                <p className="mt-1 text-sm text-zinc-700">{review.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}
