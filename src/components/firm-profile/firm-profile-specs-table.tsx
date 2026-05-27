import type { PropFirm } from "@prisma/client";
import { countryFlag, countryLabel, parseList, platformLabel } from "@/lib/firm-utils";
import { featureLabel } from "@/lib/firm-profile";

type FirmWithReviews = PropFirm & { reviews: { rating: number }[] };

type SpecRow = { label: string; value: string };

function SpecCell({ label, value }: SpecRow) {
  return (
    <>
      <dt className="bg-zinc-50 px-3 py-2.5 text-label">{label}</dt>
      <dd className="px-3 py-2.5 text-sm text-zinc-900">{value}</dd>
    </>
  );
}

export function FirmProfileSpecsTable({
  firm,
  rating,
  reviewCount,
}: {
  firm: FirmWithReviews;
  rating: number | null;
  reviewCount: number;
}) {
  const platforms = parseList(firm.platforms);
  const assets = parseList(firm.assetTypes);

  const rows: SpecRow[] = [
    { label: "Challenge types", value: firm.challengeTypes ?? (firm.instantFunded ? "Instant" : "—") },
    { label: "Max account size", value: firm.maxAllocation ?? "—" },
    {
      label: "Profit split",
      value: firm.profitSplit ?? "—",
    },
    {
      label: "Payout frequency",
      value: firm.payoutFrequency ?? firm.payoutSpeed ?? "—",
    },
    {
      label: "Min challenge fee",
      value: firm.startingPrice ?? (firm.minFee != null ? `from $${firm.minFee}` : "—"),
    },
    {
      label: "Max challenge fee",
      value: firm.maxChallengeFee != null ? `$${firm.maxChallengeFee}` : "—",
    },
    { label: "Daily drawdown", value: firm.dailyDrawdown ?? "—" },
    { label: "Max drawdown", value: firm.maxDrawdown ?? "—" },
    { label: "Profit target P1", value: firm.profitTargetP1 ?? "—" },
    { label: "Profit target P2", value: firm.profitTargetP2 ?? "—" },
    {
      label: "Platforms",
      value: platforms.length ? platforms.map(platformLabel).join(", ") : "—",
    },
    { label: "Broker", value: firm.brokerName ?? "—" },
    {
      label: "Instruments",
      value: assets.length ? assets.join(", ") : "—",
    },
    {
      label: "Country",
      value: `${countryFlag(firm.countryCode)} ${countryLabel(firm.countryCode)}`,
    },
    { label: "Min trading days", value: firm.minTradingDays ?? "—" },
    { label: "Max trading days", value: firm.maxTradingDays ?? (firm.noTimeLimit ? "Unlimited" : "—") },
    {
      label: "Weekend holding",
      value: featureLabel("weekend", firm.weekendHolding, {
        customTrue: "Allowed",
        customFalse: "Not allowed",
      }),
    },
    {
      label: "News trading",
      value: firm.newsTrading ? "Allowed" : "Restricted in funded",
    },
    {
      label: "Copy trading",
      value: featureLabel("copy", firm.copyTrading, {
        customTrue: "Allowed",
        customFalse: "Not allowed",
      }),
    },
    {
      label: "Expert advisors",
      value: featureLabel("ea", firm.expertAdvisors, {
        customTrue: "Allowed",
        customFalse: "Not allowed",
      }),
    },
    { label: "Scaling plan", value: firm.scalingPlan ?? "—" },
    { label: "Swap free", value: firm.swapFree ?? "—" },
    { label: "PropCompare users", value: firm.referralStats ?? "—" },
    {
      label: "PropCompare rating",
      value: rating != null ? `★ ${rating.toFixed(1)} / 5.0 (${reviewCount} reviews)` : "—",
    },
  ];

  const pairs: [SpecRow, SpecRow][] = [];
  for (let i = 0; i < rows.length; i += 2) {
    pairs.push([rows[i], rows[i + 1] ?? { label: "", value: "" }]);
  }

  return (
    <section>
      <h2 className="section-title">Specifications</h2>
      <dl className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
        {pairs.map(([left, right], i) => (
          <div
            key={i}
            className="grid border-b border-zinc-100 last:border-0 sm:grid-cols-4"
          >
            <SpecCell {...left} />
            {right.label ? <SpecCell {...right} /> : <><dt className="hidden sm:block" /><dd className="hidden sm:block" /></>}
          </div>
        ))}
      </dl>
      {firm.drawdownTypes && (
        <p className="mt-2 text-xs text-zinc-500">Drawdown type: {firm.drawdownTypes}</p>
      )}
    </section>
  );
}
