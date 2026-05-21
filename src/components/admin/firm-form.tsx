"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type FirmFormData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  assetTypes: string;
  profitSplit: string;
  maxDrawdown: string;
  minFee: string;
  featured: boolean;
  published: boolean;
};

const empty: FirmFormData = {
  name: "",
  slug: "",
  description: "",
  websiteUrl: "",
  logoUrl: "",
  assetTypes: "forex,crypto",
  profitSplit: "",
  maxDrawdown: "",
  minFee: "",
  featured: false,
  published: true,
};

export function FirmForm({ initial }: { initial?: Partial<FirmFormData> }) {
  const router = useRouter();
  const [form, setForm] = useState<FirmFormData>({ ...empty, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = !!initial?.id;

  function set<K extends keyof FirmFormData>(key: K, value: FirmFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      minFee: form.minFee ? Number(form.minFee) : null,
      description: form.description || null,
      websiteUrl: form.websiteUrl || null,
      logoUrl: form.logoUrl || null,
      profitSplit: form.profitSplit || null,
      maxDrawdown: form.maxDrawdown || null,
      slug: form.slug || undefined,
    };

    const url = isEdit ? `/api/admin/firms/${initial!.id}` : "/api/admin/firms";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error?.toString?.() ?? data.error ?? "Save failed");
      return;
    }

    router.push("/admin/firms");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <Field label="Name" required>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </Field>

      <Field label="Slug (URL)" hint="Leave empty to auto-generate from name">
        <input
          className={inputClass}
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="ftmo"
        />
      </Field>

      <Field label="Description">
        <textarea
          className={inputClass}
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Website URL">
          <input
            className={inputClass}
            type="url"
            value={form.websiteUrl}
            onChange={(e) => set("websiteUrl", e.target.value)}
          />
        </Field>
        <Field label="Logo URL">
          <input
            className={inputClass}
            value={form.logoUrl}
            onChange={(e) => set("logoUrl", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Asset types" hint="Comma-separated, e.g. forex,crypto,futures">
        <input
          className={inputClass}
          value={form.assetTypes}
          onChange={(e) => set("assetTypes", e.target.value)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Profit split">
          <input
            className={inputClass}
            placeholder="80/20"
            value={form.profitSplit}
            onChange={(e) => set("profitSplit", e.target.value)}
          />
        </Field>
        <Field label="Max drawdown">
          <input
            className={inputClass}
            placeholder="10%"
            value={form.maxDrawdown}
            onChange={(e) => set("maxDrawdown", e.target.value)}
          />
        </Field>
        <Field label="Min fee ($)">
          <input
            className={inputClass}
            type="number"
            step="0.01"
            value={form.minFee}
            onChange={(e) => set("minFee", e.target.value)}
          />
        </Field>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Published (visible on site)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create firm"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
