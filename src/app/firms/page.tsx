import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FirmsPage() {
  const firms = await prisma.propFirm.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    include: {
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Prop firms</h1>
      <p className="mt-2 text-zinc-600">Compare rules, fees, and trader reviews.</p>

      <ul className="mt-8 space-y-4">
        {firms.map((firm) => {
          const ratings = firm.reviews.map((r) => r.rating);
          const avg =
            ratings.length > 0
              ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
              : null;

          return (
            <li key={firm.id}>
              <Link
                href={`/firms/${firm.slug}`}
                className="block rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {firm.name}
                      {firm.featured && (
                        <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                          Featured
                        </span>
                      )}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                      {firm.description}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {firm.assetTypes} · Split {firm.profitSplit ?? "—"} · From $
                      {firm.minFee ?? "—"}
                    </p>
                  </div>
                  {avg && (
                    <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium">
                      ★ {avg}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
