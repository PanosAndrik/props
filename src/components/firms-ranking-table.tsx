import Link from "next/link";
import { FirmLogo } from "@/components/firm-logo";
import { FirmsRankingMobileCards } from "@/components/firms-ranking-mobile-cards";
import type { FirmSortKey, FirmWithReviews } from "@/lib/firm-sort";
import {
  avgRating,
  countryFlag,
  countryLabel,
  parseList,
  platformLabel,
  yearsInOperation,
} from "@/lib/firm-utils";

export function FirmsRankingTable({
  firms,
  sort = "rank",
}: {
  firms: FirmWithReviews[];
  sort?: FirmSortKey;
}) {
  return (
    <>
      <FirmsRankingMobileCards firms={firms} sort={sort} />
      <div className="-mx-4 hidden overflow-x-auto px-4 md:block md:mx-0 md:px-0">
      <div className="inline-block min-w-full rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Firm</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Years</th>
            <th className="px-4 py-3">Assets</th>
            <th className="px-4 py-3">Platforms</th>
            <th className="px-4 py-3">Max allocation</th>
            <th className="px-4 py-3">Promo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {firms.map((firm, index) => {
            const rating = avgRating(firm.reviews);
            const assets = parseList(firm.assetTypes);
            const platforms = parseList(firm.platforms);
            const position = sort === "rank" ? firm.rankOrder : index + 1;

            return (
              <tr key={firm.id} className="hover:bg-zinc-50/80">
                <td className="px-4 py-4 font-semibold text-zinc-400">
                  {position <= 3 ? (
                    <span className="text-amber-600">{position}</span>
                  ) : (
                    position
                  )}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/firms/${firm.slug}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <FirmLogo name={firm.name} logoUrl={firm.logoUrl} size="sm" />
                    <div>
                      <p className="font-semibold text-zinc-900">
                        {firm.name}
                        {firm.isNew && (
                          <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                            New
                          </span>
                        )}
                      </p>
                      <p className="text-xs capitalize text-zinc-500">{firm.category}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4">
                  {rating !== null ? (
                    <span className="font-medium text-amber-700">
                      ★ {rating.toFixed(1)}
                      <span className="ml-1 text-xs font-normal text-zinc-500">
                        ({firm.reviews.length})
                      </span>
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span title={countryLabel(firm.countryCode)}>
                    {countryFlag(firm.countryCode)}{" "}
                    <span className="text-zinc-700">{firm.countryCode ?? "—"}</span>
                  </span>
                </td>
                <td className="px-4 py-4 text-zinc-700">
                  {yearsInOperation(firm.foundedAt)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex max-w-[140px] flex-wrap gap-1">
                    {assets.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-600"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {platforms.length > 0 ? (
                      platforms.map((p) => (
                        <span
                          key={p}
                          className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700"
                        >
                          {platformLabel(p)}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-zinc-800">
                  {firm.maxAllocation ?? "—"}
                </td>
                <td className="px-4 py-4">
                  {firm.discountPercent || firm.discountCode ? (
                    <div>
                      {firm.discountPercent ? (
                        <span className="font-semibold text-emerald-700">
                          {firm.discountPercent}% OFF
                        </span>
                      ) : null}
                      {firm.discountCode && (
                        <p className="font-mono text-xs text-zinc-600">{firm.discountCode}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {firms.length === 0 && (
        <p className="px-4 py-12 text-center text-sm text-zinc-500">No firms found.</p>
      )}
      </div>
      </div>
    </>
  );
}
