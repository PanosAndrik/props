"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FirmFilters({ assetOptions }: { assetOptions: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/firms?${next.toString()}`);
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <input
        type="search"
        placeholder="Search firms…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          clearTimeout((window as unknown as { _firmSearch?: ReturnType<typeof setTimeout> })._firmSearch);
          (window as unknown as { _firmSearch?: ReturnType<typeof setTimeout> })._firmSearch = setTimeout(
            () => update("q", v),
            300
          );
        }}
        className="min-w-[200px] flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <select
        defaultValue={params.get("asset") ?? ""}
        onChange={(e) => update("asset", e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      >
        <option value="">All assets</option>
        {assetOptions.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm">
        <input
          type="checkbox"
          defaultChecked={params.get("featured") === "1"}
          onChange={(e) => update("featured", e.target.checked ? "1" : "")}
        />
        Featured only
      </label>
    </div>
  );
}
