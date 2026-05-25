"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@prisma/client";

export function SiteSettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  const fields: { key: keyof SiteSettings; label: string; hint?: string }[] = [
    { key: "statFirmsValue", label: "Firms stat (big number)", hint: "e.g. 200+" },
    { key: "statFirmsLabel", label: "Firms stat label", hint: "e.g. Prop firms" },
    { key: "statTradersValue", label: "Traders stat", hint: "e.g. 50,000+" },
    { key: "statTradersLabel", label: "Traders label" },
    { key: "statCouponsValue", label: "Coupons stat", hint: "e.g. Exclusive" },
    { key: "statCouponsLabel", label: "Coupons label" },
    { key: "statFreeValue", label: "Free stat", hint: "e.g. Free" },
    { key: "statFreeLabel", label: "Free label" },
    { key: "offersTitle", label: "Offers section title" },
    { key: "offersSubtitle", label: "Offers section subtitle" },
    { key: "newsletterTitle", label: "Newsletter CTA title" },
    { key: "newsletterSubtitle", label: "Newsletter CTA subtitle" },
  ];

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {saved && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">Saved.</p>
      )}
      <p className="text-sm text-zinc-600">
        Homepage stats and offers text. Use marketing numbers if you want (they do not need to match real DB counts).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label, hint }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-zinc-700">{label}</label>
            {hint && <p className="text-xs text-zinc-500">{hint}</p>}
            <input
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              value={(form[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
