import Link from "next/link";
import type { FirmChallenge, PropFirm, Review, User } from "@prisma/client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FirmLogo } from "@/components/firm-logo";
import { FavoriteButton } from "@/components/favorite-button";
import { FirmStickyCta } from "@/components/firm-sticky-cta";
import { FirmProfileCouponBlock } from "@/components/firm-profile/firm-profile-coupon-block";
import { FirmProfileSpecsTable } from "@/components/firm-profile/firm-profile-specs-table";
import { affiliateOutUrl } from "@/lib/affiliate-out";
import { assetTags, formatFoundedYear, trustScoreLabel } from "@/lib/firm-profile";
import {
  avgRating,
  countryFlag,
  countryLabel,
  parseJsonList,
  yearsInOperation,
} from "@/lib/firm-utils";
import { ReviewForm } from "@/app/(site)/firms/[slug]/review-form";

type ReviewWithUser = Review & { user: Pick<User, "name" | "email"> };

type FirmData = PropFirm & {
  reviews: ReviewWithUser[];
  challenges: FirmChallenge[];
};

export function FirmProfileView({
  firm,
  isLoggedIn,
  isFavorited,
  hasUserReview,
}: {
  firm: FirmData;
  isLoggedIn: boolean;
  isFavorited: boolean;
  hasUserReview: boolean;
}) {
  const rating = avgRating(firm.reviews);
  const pros = parseJsonList(firm.pros);
  const cons = parseJsonList(firm.cons);
  const tags = assetTags(firm.assetTypes);
  const hasOutbound = !!(firm.affiliateUrl || firm.websiteUrl);
  const foundedYear = formatFoundedYear(firm.foundedAt);
  const hq =
    firm.headquarters ??
    (firm.countryCode ? countryLabel(firm.countryCode) : null);
  const profileUpdated =
    firm.profileUpdatedAt ?? firm.updatedAt;
  const latestReviews = firm.reviews.slice(0, 2);

  const metricCards = [
    {
      label: "Max account size",
      value: firm.maxAllocation,
      className: "border-blue-200 bg-blue-50 text-blue-900",
    },
    {
      label: "Profit split",
      value: firm.profitSplit,
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
    {
      label: "Starting price",
      value: firm.startingPrice ?? (firm.minFee != null ? `from $${firm.minFee}` : null),
      className: "border-orange-200 bg-orange-50 text-orange-900",
    },
    {
      label: "Payout speed",
      value: firm.payoutSpeed ?? firm.payoutFrequency,
      className: "border-violet-200 bg-violet-50 text-violet-900",
    },
  ].filter((c) => c.value);

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-8 pb-28 md:pb-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "All firms", href: "/firms" },
          { label: firm.name },
        ]}
      />

      {/* Hero */}
      <header className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="page-title">{firm.name}</h1>
                {firm.isNew && (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    NEW
                  </span>
                )}
              </div>
              <p className="mt-1 text-body-sm">
                {[hq, foundedYear && `Founded ${foundedYear}`, yearsInOperation(firm.foundedAt) && `${yearsInOperation(firm.foundedAt)}+ years`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t.label}
                      className={`rounded border px-2 py-0.5 text-xs font-semibold ${t.className}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {firm.verified && (
              <span className="rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                PROPCOMPARE VERIFIED
              </span>
            )}
            {rating !== null && (
              <p className="text-lg font-semibold text-amber-700">
                ★ {rating.toFixed(1)} / 5.0
                <span className="ml-1 text-sm font-normal text-zinc-500">
                  ({firm.reviews.length} reviews)
                </span>
              </p>
            )}
            <FavoriteButton
              firmId={firm.id}
              firmName={firm.name}
              initialFavorited={isFavorited}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </header>

      {/* Trust score */}
      {firm.trustScore != null && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="text-label text-emerald-800">
            Trust score
          </span>
          <span className="stat-value text-emerald-900">
            {firm.trustScore} / 100 — {trustScoreLabel(firm.trustScore)}
          </span>
          <span className="text-xs text-emerald-700">
            Last updated:{" "}
            {profileUpdated.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      )}

      {/* Metric cards */}
      {metricCards.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((m) => (
            <div
              key={m.label}
              className={`rounded-xl border p-4 text-center ${m.className}`}
            >
              <p className="text-label opacity-80">{m.label}</p>
              <p className="mt-1 stat-value">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-10">
        <FirmProfileCouponBlock
          slug={firm.slug}
          firmName={firm.name}
          discountCode={firm.discountCode}
          discountPercent={firm.discountPercent}
          hasOutbound={hasOutbound}
        />

        {(firm.incentiveText || firm.referralStats) && (
          <section className="rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
            {firm.incentiveText && (
              <p className="text-sm leading-relaxed text-sky-950">{firm.incentiveText}</p>
            )}
            {firm.referralStats && (
              <p className="mt-3 shrink-0 text-sm font-semibold text-sky-800 sm:mt-0">
                {firm.referralStats}
              </p>
            )}
          </section>
        )}

        {/* Quick overview */}
        <section>
          <h2 className="section-title">Quick overview</h2>
          <dl className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
            {[
              { label: "Company name", value: firm.legalName ?? firm.name },
              { label: "Headquarters", value: hq ?? "—" },
              { label: "Founded", value: foundedYear ?? "—" },
              {
                label: "Years active",
                value: yearsInOperation(firm.foundedAt)
                  ? `${yearsInOperation(firm.foundedAt)}+ years`
                  : "—",
              },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`grid sm:grid-cols-2 ${i > 0 ? "border-t border-zinc-100" : ""}`}
              >
                <dt className="bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-500">
                  {row.label}
                </dt>
                <dd className="px-4 py-3 text-sm font-medium text-zinc-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <FirmProfileSpecsTable firm={firm} rating={rating} reviewCount={firm.reviews.length} />

        {/* Challenges */}
        <section id="challenges" className="scroll-mt-24">
          <h2 className="section-title">Challenges & pricing</h2>
          {firm.challenges.length === 0 ? (
            <p className="mt-3 text-caption">No challenges listed yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 table-head">
                  <tr>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Drawdown</th>
                    <th className="px-4 py-3">Split</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {firm.challenges.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">{c.accountSize ?? "—"}</td>
                      <td className="px-4 py-3">{c.price != null ? `$${c.price}` : "—"}</td>
                      <td className="px-4 py-3">{c.profitTarget ?? "—"}</td>
                      <td className="px-4 py-3">{c.maxDrawdown ?? "—"}</td>
                      <td className="px-4 py-3">{c.profitSplit ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="rules" className="scroll-mt-24">
          <h2 className="section-title">Rules & restrictions</h2>
          <div className="prose-content prose-zinc mt-3 max-w-none text-sm sm:text-base">
            {firm.rulesDetail ? (
              <p className="whitespace-pre-wrap">{firm.rulesDetail}</p>
            ) : (
              <p className="text-zinc-600">
                {firm.longOverview || firm.description || "Rules overview coming soon."}
              </p>
            )}
          </div>
        </section>

        <section id="drawdown" className="scroll-mt-24">
          <h2 className="section-title">Drawdown explained</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
            {firm.drawdownExplained ??
              firm.drawdownTypes ??
              `Max drawdown: ${firm.maxDrawdown ?? "See challenge table."}`}
          </p>
        </section>

        {/* Pros & cons */}
        {(pros.length > 0 || cons.length > 0) && (
          <section>
            <h2 className="section-title">Pros & cons — quick summary</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {pros.length > 0 && (
                <div className="overflow-hidden rounded-xl border-2 border-emerald-500">
                  <div className="bg-emerald-600 px-4 py-2 text-sm font-bold text-white">PROS</div>
                  <ul className="space-y-2 p-4 text-sm text-zinc-800">
                    {pros.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="text-emerald-600">■</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons.length > 0 && (
                <div className="overflow-hidden rounded-xl border-2 border-red-500">
                  <div className="bg-red-600 px-4 py-2 text-sm font-bold text-white">CONS</div>
                  <ul className="space-y-2 p-4 text-sm text-zinc-800">
                    {cons.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span className="text-red-600">■</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        <section id="reviews" className="scroll-mt-24">
          <h2 className="section-title">Latest reviews</h2>
          {latestReviews.length === 0 ? (
            <p className="mt-3 text-caption">No approved reviews yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {latestReviews.map((review) => (
                <li key={review.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-semibold">
                      {review.user.name ?? review.user.email.split("@")[0]}
                    </span>
                    <span className="text-amber-700">
                      {"★".repeat(review.rating)} {review.rating}.0 / 5
                    </span>
                  </div>
                  {review.title && <p className="mt-2 font-medium">{review.title}</p>}
                  <p className="mt-2 text-sm text-zinc-700">&ldquo;{review.body}&rdquo;</p>
                </li>
              ))}
            </ul>
          )}
          {firm.reviews.length > 0 && (
            <div className="mt-6">
              <Link
                href={`/reviews?firm=${firm.slug}`}
                className="inline-flex rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                All reviews
              </Link>
            </div>
          )}

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <h3 className="subsection-title">Write a review</h3>
            {hasUserReview ? (
              <p className="mt-3 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
                You already submitted a review for this firm.
              </p>
            ) : isLoggedIn ? (
              <ReviewForm firmId={firm.id} firmName={firm.name} />
            ) : (
              <p className="mt-3 text-body-sm">
                <Link href="/auth/signin" className="font-medium underline">
                  Sign in
                </Link>{" "}
                to submit a review.
              </p>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        {hasOutbound && (
          <section className="rounded-xl bg-zinc-900 px-6 py-8 text-center text-white">
            <h2 className="section-title">
              Your funded trading career starts here.
            </h2>
            {firm.referralStats && (
              <p className="mt-2 text-sm text-zinc-300">{firm.referralStats}</p>
            )}
            {firm.discountCode && (
              <p className="coupon-code mt-4 text-amber-300">
                {firm.discountCode}
                {firm.discountPercent != null && (
                  <span className="mt-1 block text-sm font-normal text-amber-200/90">
                    {firm.discountPercent}% off — copy at checkout
                  </span>
                )}
              </p>
            )}
            <a
              href={affiliateOutUrl(firm.slug, "firm-bottom-cta")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Get funded with {firm.name} →
            </a>
          </section>
        )}
      </div>

      <FirmStickyCta
        slug={firm.slug}
        firmName={firm.name}
        discountCode={firm.discountCode}
        discountPercent={firm.discountPercent}
        hasOutbound={hasOutbound}
      />
    </main>
  );
}
