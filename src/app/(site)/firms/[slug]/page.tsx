import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "./review-form";
import { FirmOfferCard } from "@/components/firm-offer-card";
import { FirmLogo } from "@/components/firm-logo";
import {
  avgRating,
  countryFlag,
  countryLabel,
  parseJsonList,
  parseList,
  platformLabel,
  yearsInOperation,
} from "@/lib/firm-utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const firm = await prisma.propFirm.findUnique({
    where: { slug, published: true },
    select: { name: true, description: true },
  });
  if (!firm) return { title: "Firm not found" };
  return {
    title: `${firm.name} — Reviews & Coupon | PropCompare`,
    description: firm.description ?? `Compare ${firm.name} rules, fees, and trader reviews.`,
  };
}

export default async function FirmDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const userReview =
    session?.user?.id
      ? await prisma.review.findFirst({
          where: { firm: { slug }, userId: session.user.id },
          select: { status: true },
        })
      : null;

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

  const rating = avgRating(firm.reviews);
  const assets = parseList(firm.assetTypes);
  const platforms = parseList(firm.platforms);
  const pros = parseJsonList(firm.pros);
  const cons = parseJsonList(firm.cons);

  const metrics = [
    { label: "Profit split", value: firm.profitSplit },
    { label: "Payout speed", value: firm.payoutSpeed },
    { label: "Max allocation", value: firm.maxAllocation },
    { label: "Starting price", value: firm.startingPrice },
    { label: "Max drawdown", value: firm.maxDrawdown },
  ].filter((m) => m.value);

  const features = [
    { label: "News trading", yes: firm.newsTrading },
    { label: "Weekend holding", yes: firm.weekendHolding },
    { label: "Expert advisors", yes: firm.expertAdvisors },
    { label: "Copy trading", yes: firm.copyTrading },
    { label: "No time limit", yes: firm.noTimeLimit },
    { label: "Consistency rule", yes: firm.consistencyRule, badWhenYes: true },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/firms" className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Rankings
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex gap-4">
          <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{firm.name}</h1>
              {firm.isNew && (
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">NEW</span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-600 capitalize">
              {firm.category} · {countryFlag(firm.countryCode)} {countryLabel(firm.countryCode)} ·{" "}
              {yearsInOperation(firm.foundedAt)} yrs
            </p>
            {rating !== null && (
              <p className="mt-2 text-lg font-medium text-amber-700">
                ★ {rating.toFixed(1)} · {firm.reviews.length} review
                {firm.reviews.length !== 1 ? "s" : ""}
              </p>
            )}
            {firm.ceoName && (
              <p className="mt-1 text-sm text-zinc-500">CEO: {firm.ceoName}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/compare?firms=${firm.slug}`}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Add to compare
          </Link>
          {(firm.affiliateUrl || firm.websiteUrl) && (
            <a
              href={firm.affiliateUrl ?? firm.websiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Visit site →
            </a>
          )}
        </div>
      </div>

      {metrics.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
              <p className="text-xs font-medium uppercase text-zinc-500">{m.label}</p>
              <p className="mt-1 text-lg font-bold text-zinc-900">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <FirmOfferCard
        firmName={firm.name}
        discountCode={firm.discountCode}
        discountPercent={firm.discountPercent}
        affiliateUrl={firm.affiliateUrl}
        websiteUrl={firm.websiteUrl}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-3 text-zinc-700 leading-relaxed">
              {firm.longOverview || firm.description}
            </p>
          </section>

          {(pros.length > 0 || cons.length > 0) && (
            <section className="grid gap-4 sm:grid-cols-2">
              {pros.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <h3 className="font-semibold text-emerald-900">Pros</h3>
                  <ul className="mt-3 space-y-2 text-sm text-emerald-950">
                    {pros.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
                  <h3 className="font-semibold text-red-900">Cons</h3>
                  <ul className="mt-3 space-y-2 text-sm text-red-950">
                    {cons.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span>✕</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold">Reviews</h2>
            <ul className="mt-4 space-y-4">
              {firm.reviews.map((review) => (
                <li key={review.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-amber-700">{"★".repeat(review.rating)}</span>
                    <span className="text-xs text-zinc-500">{review.user.name ?? review.user.email}</span>
                  </div>
                  {review.title && <p className="mt-2 font-medium">{review.title}</p>}
                  <p className="mt-1 text-sm text-zinc-700">{review.body}</p>
                </li>
              ))}
              {firm.reviews.length === 0 && (
                <p className="text-sm text-zinc-500">No approved reviews yet.</p>
              )}
            </ul>

            <div className="mt-10 border-t border-zinc-200 pt-8">
              <h3 className="text-lg font-semibold">Write a review</h3>
              {userReview ? (
                <p className="mt-4 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
                  You already submitted a review for this firm.
                </p>
              ) : session ? (
                <ReviewForm firmId={firm.id} firmName={firm.name} />
              ) : (
                <p className="mt-4 text-sm text-zinc-600">
                  <Link href="/auth/signin" className="font-medium underline">Sign in</Link> to submit a review.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm">
            <h3 className="font-semibold">Firm details</h3>
            <dl className="mt-3 space-y-2">
              <div><dt className="text-zinc-500">Assets</dt><dd className="font-medium">{assets.join(", ") || "—"}</dd></div>
              <div>
                <dt className="text-zinc-500">Platforms</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {platforms.map((p) => (
                    <span key={p} className="rounded border px-1.5 py-0.5 text-xs">{platformLabel(p)}</span>
                  ))}
                  {platforms.length === 0 && "—"}
                </dd>
              </div>
              {firm.drawdownTypes && (
                <div><dt className="text-zinc-500">Drawdown</dt><dd>{firm.drawdownTypes}</dd></div>
              )}
              {firm.minFee != null && (
                <div><dt className="text-zinc-500">Min fee</dt><dd>${firm.minFee}</dd></div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm">
            <h3 className="font-semibold">Features</h3>
            <ul className="mt-3 space-y-2">
              {features.map((f) => {
                const positive = f.badWhenYes ? !f.yes : f.yes;
                return (
                  <li key={f.label} className="flex justify-between">
                    <span>{f.label}</span>
                    <span className={positive ? "font-medium text-emerald-600" : "text-zinc-500"}>
                      {f.badWhenYes ? (f.yes ? "Applies" : "No") : f.yes ? "Yes" : "No"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
