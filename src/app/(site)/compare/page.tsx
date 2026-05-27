import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ComparePicker } from "@/components/compare-picker";
import { CompareShareButton } from "@/components/compare-share-button";
import { CompareSync } from "@/components/compare-sync";
import { affiliateOutUrl } from "@/lib/affiliate-out";

export const metadata: Metadata = {
  title: "Compare Prop Firms | PropCompare",
  description: "Side-by-side comparison of prop firm fees, rules, ratings, and coupons.",
};

type Props = { searchParams: Promise<{ firms?: string }> };

function yesNo(v: boolean) {
  return v ? "Yes" : "No";
}

export default async function ComparePage({ searchParams }: Props) {
  const { firms: firmsParam } = await searchParams;
  const slugs = firmsParam?.split(",").filter(Boolean).slice(0, 3) ?? [];

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
            challenges: {
              where: { published: true },
              select: { id: true },
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

  const sharePath =
    slugs.length >= 2 ? `/compare?firms=${slugs.join(",")}` : "/compare";

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Compare" },
        ]}
      />
      <h1 className="page-title">Compare prop firms</h1>
      <p className="mt-2 text-muted">
        Side-by-side comparison of fees, rules, and ratings.
      </p>

      {ordered.length >= 2 && <CompareSync slugs={slugs} />}

      {ordered.length < 2 ? (
        <ComparePicker firms={allFirms} />
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/compare" className="text-sm text-amber-700 hover:underline">
              ← Change selection
            </Link>
            <CompareShareButton path={sharePath} />
          </div>

          <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 table-head">
                  <th className="px-4 py-3">Feature</th>
                  {ordered.map((f) => (
                    <th key={f.id} className="px-4 py-3 normal-case">
                      <Link href={`/firms/${f.slug}`} className="hover:underline">
                        {f.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <CompareRow label="Rating" values={ordered.map(avgRating)} />
                <CompareRow label="Category" values={ordered.map((f) => f.category)} />
                <CompareRow label="Assets" values={ordered.map((f) => f.assetTypes)} />
                <CompareRow label="Platforms" values={ordered.map((f) => f.platforms || "—")} />
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
                  label="Max allocation"
                  values={ordered.map((f) => f.maxAllocation ?? "—")}
                />
                <CompareRow
                  label="Payout speed"
                  values={ordered.map((f) => f.payoutSpeed ?? "—")}
                />
                <CompareRow
                  label="Challenges"
                  values={ordered.map((f) =>
                    f.challenges.length > 0 ? `${f.challenges.length} plans` : "—"
                  )}
                />
                <CompareRow
                  label="Instant funded"
                  values={ordered.map((f) => yesNo(f.instantFunded))}
                />
                <CompareRow
                  label="News trading"
                  values={ordered.map((f) => yesNo(f.newsTrading))}
                />
                <CompareRow
                  label="Weekend holding"
                  values={ordered.map((f) => yesNo(f.weekendHolding))}
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
                    const hasOutbound = !!(f.affiliateUrl ?? f.websiteUrl);
                    return hasOutbound ? (
                      <a
                        key={f.id}
                        href={affiliateOutUrl(f.slug, "compare")}
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
      <td className="text-label px-4 py-3 normal-case">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3">
          {v}
        </td>
      ))}
    </tr>
  );
}
