import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ComparePicker } from "@/components/compare-picker";

type Props = { searchParams: Promise<{ firms?: string }> };

export default async function ComparePage({ searchParams }: Props) {
  const { firms: firmsParam } = await searchParams;
  const slugs = firmsParam?.split(",").filter(Boolean) ?? [];

  const allFirms = await prisma.propFirm.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const compareFirms =
    slugs.length >= 2
      ? await prisma.propFirm.findMany({
          where: { slug: { in: slugs }, published: true },
          include: {
            reviews: {
              where: { status: "APPROVED" },
              select: { rating: true },
            },
          },
        })
      : [];

  const ordered =
    slugs.length >= 2
      ? slugs
          .map((s) => compareFirms.find((f) => f.slug === s))
          .filter((f): f is NonNullable<typeof f> => !!f)
      : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Compare prop firms</h1>
      <p className="mt-2 text-zinc-600">
        Side-by-side comparison of fees, rules, and ratings.
      </p>

      {ordered.length < 2 ? (
        <ComparePicker firms={allFirms} />
      ) : (
        <>
          <Link
            href="/compare"
            className="mt-6 inline-block text-sm text-amber-700 hover:underline"
          >
            ← Change selection
          </Link>

          <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-zinc-500">Feature</th>
                  {ordered.map((f) => (
                    <th key={f.id} className="px-4 py-3 font-semibold">
                      <Link href={`/firms/${f.slug}`} className="hover:underline">
                        {f.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <CompareRow label="Rating" values={ordered.map(avgRating)} />
                <CompareRow label="Assets" values={ordered.map((f) => f.assetTypes)} />
                <CompareRow
                  label="Profit split"
                  values={ordered.map((f) => f.profitSplit ?? "—")}
                />
                <CompareRow
                  label="Max drawdown"
                  values={ordered.map((f) => f.maxDrawdown ?? "—")}
                />
                <CompareRow
                  label="Min fee"
                  values={ordered.map((f) =>
                    f.minFee != null ? `$${f.minFee}` : "—"
                  )}
                />
                <CompareRow
                  label="Discount"
                  values={ordered.map((f) =>
                    f.discountPercent
                      ? `${f.discountPercent}%${f.discountCode ? ` · ${f.discountCode}` : ""}`
                      : f.discountCode ?? "—"
                  )}
                />
                <CompareRow
                  label="Link"
                  values={ordered.map((f) => {
                    const url = f.affiliateUrl ?? f.websiteUrl;
                    return url ? (
                      <a
                        key={f.id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-700 hover:underline"
                      >
                        Visit
                      </a>
                    ) : (
                      "—"
                    );
                  })}
                />
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

function avgRating(firm: {
  reviews: { rating: number }[];
}): string {
  if (firm.reviews.length === 0) return "—";
  const avg =
    firm.reviews.reduce((s, r) => s + r.rating, 0) / firm.reviews.length;
  return `★ ${avg.toFixed(1)} (${firm.reviews.length})`;
}

function CompareRow({
  label,
  values,
}: {
  label: string;
  values: (string | React.ReactNode)[];
}) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-zinc-500">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3">
          {v}
        </td>
      ))}
    </tr>
  );
}
