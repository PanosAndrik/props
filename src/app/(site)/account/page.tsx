import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile-form";

const statusLabels = {
  PENDING: { text: "Pending approval", className: "bg-amber-100 text-amber-800" },
  APPROVED: { text: "Published", className: "bg-emerald-100 text-emerald-800" },
  REJECTED: { text: "Rejected", className: "bg-red-100 text-red-800" },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      reviews: {
        include: { firm: { select: { name: true, slug: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/signin");

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">My account</h1>
      <p className="mt-2 text-zinc-600">Your profile and submitted reviews.</p>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="font-semibold text-zinc-900">Profile</h2>
        <p className="mt-2 text-sm text-zinc-600">{user.email}</p>
        <p className="mt-1 text-xs text-zinc-500">
          Member since {user.createdAt.toLocaleDateString()}
        </p>
        <ProfileForm initialName={user.name ?? ""} />
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-zinc-900">My reviews</h2>
        {user.reviews.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            You haven&apos;t submitted any reviews yet.{" "}
            <Link href="/firms" className="text-amber-700 underline">
              Browse firms
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {user.reviews.map((review) => {
              const status = statusLabels[review.status];
              return (
                <li
                  key={review.id}
                  className="rounded-xl border border-zinc-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/firms/${review.firm.slug}`}
                      className="font-medium hover:underline"
                    >
                      {review.firm.name}
                    </Link>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.text}
                    </span>
                  </div>
                  <p className="mt-2 text-amber-700">{"★".repeat(review.rating)}</p>
                  {review.title && (
                    <p className="mt-1 font-medium">{review.title}</p>
                  )}
                  <p className="mt-1 text-sm text-zinc-600">{review.body}</p>
                  <p className="mt-2 text-xs text-zinc-400">
                    {review.createdAt.toLocaleString()}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
