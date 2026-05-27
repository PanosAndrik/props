import Link from "next/link";
import {
  getAffiliateAnalyticsSummary,
  type AffiliateAnalyticsSummary,
} from "@/lib/affiliate-analytics";

export default async function AdminAnalyticsPage() {
  const data: AffiliateAnalyticsSummary = await getAffiliateAnalyticsSummary();

  return (
    <>
      <h2 className="page-title">Affiliate click analytics</h2>
      <p className="mt-1 text-body-sm">
        Outbound clicks via <code className="rounded bg-zinc-100 px-1">/out/[slug]</code> tracking
        links (last 30 days breakdown below).
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Last 7 days" value={data.last7} />
        <Stat label="Last 30 days" value={data.last30} />
        <Stat label="All time" value={data.total} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="subsection-title">Clicks by firm (30d)</h3>
          {data.clicksByFirm.length === 0 ? (
            <p className="mt-4 text-caption">No clicks recorded yet.</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 table-head">
                  <th className="pb-2">Firm</th>
                  <th className="pb-2 text-right">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data.clicksByFirm.map((row) => (
                  <tr key={row.firm.id}>
                    <td className="py-2">
                      <Link
                        href={`/firms/${row.firm.slug}`}
                        className="font-medium hover:underline"
                        target="_blank"
                      >
                        {row.firm.name}
                      </Link>
                    </td>
                    <td className="py-2 text-right font-semibold tabular-nums">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="subsection-title">Clicks by source (30d)</h3>
          {data.clicksBySource.length === 0 ? (
            <p className="mt-4 text-caption">No data yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.clicksBySource.map((row) => (
                <li
                  key={row.source}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-zinc-700">{row.source}</span>
                  <span className="font-semibold tabular-nums">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-zinc-500">
            Sources: firm-page, firm-sticky, firm-offer, deals, offers-home, compare
          </p>
        </section>
      </div>

      <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="subsection-title">Recent clicks</h3>
        {data.recent.length === 0 ? (
          <p className="mt-4 text-caption">No clicks yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 table-head">
                  <th className="pb-2 pr-4">When</th>
                  <th className="pb-2 pr-4">Firm</th>
                  <th className="pb-2 pr-4">Source</th>
                  <th className="pb-2">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data.recent.map((click) => (
                  <tr key={click.id}>
                    <td className="py-2 pr-4 whitespace-nowrap text-zinc-500">
                      {click.createdAt.toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 font-medium">{click.firm.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{click.source}</td>
                    <td className="py-2 text-zinc-600">
                      {click.user?.email ?? "Guest"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="stat-value">{value}</p>
      <p className="text-sm font-medium text-zinc-600">{label}</p>
    </div>
  );
}
