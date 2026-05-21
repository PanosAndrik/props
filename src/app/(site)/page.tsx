import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [firmCount, reviewCount, postCount] = await Promise.all([
    prisma.propFirm.count({ where: { published: true } }),
    prisma.review.count({ where: { status: "APPROVED" } }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  const featured = await prisma.propFirm.findMany({
    where: { published: true, featured: true },
    take: 3,
    orderBy: { name: "asc" },
  });

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
            Browse firms, read verified reviews, and share your experience — built
            for your client&apos;s prop trading community.
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

      {featured.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <h2 className="mb-6 text-xl font-semibold">Featured firms</h2>
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
