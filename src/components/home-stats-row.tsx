import type { SiteSettings } from "@prisma/client";

export function HomeStatsRow({ settings }: { settings: SiteSettings }) {
  const stats = [
    { value: settings.statFirmsValue, label: settings.statFirmsLabel },
    { value: settings.statTradersValue, label: settings.statTradersLabel },
    { value: settings.statCouponsValue, label: settings.statCouponsLabel },
    { value: settings.statFreeValue, label: settings.statFreeLabel },
  ];

  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-4">
      <p className="mx-auto mb-2 max-w-6xl text-center text-[10px] text-zinc-400 sm:text-xs">
        Editorial stats — figures are for marketing context and may not match live database counts.
      </p>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-center"
          >
            <p className="text-xl font-bold text-zinc-900 sm:text-2xl">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-zinc-500 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
