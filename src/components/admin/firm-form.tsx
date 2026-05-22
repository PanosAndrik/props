"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  emptyFirmForm,
  formToPayload,
  type FirmFormState,
} from "@/lib/firm-form-mapper";

export function FirmForm({ initial }: { initial?: Partial<FirmFormState> }) {
  const router = useRouter();
  const [form, setForm] = useState<FirmFormState>({ ...emptyFirmForm, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!initial?.id;

  function set<K extends keyof FirmFormState>(key: K, value: FirmFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/admin/firms/${initial!.id}` : "/api/admin/firms";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToPayload(form)),
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
    <form onSubmit={onSubmit} noValidate className="max-w-3xl space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <Section title="General">
        <Field label="Name" required>
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="Slug" hint="Leave empty to auto-generate">
          <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Rank order" hint="1 = top of table">
            <input className={inputClass} type="number" value={form.rankOrder} onChange={(e) => set("rankOrder", e.target.value)} />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="forex">Forex</option>
              <option value="futures">Futures</option>
              <option value="crypto">Crypto</option>
            </select>
          </Field>
          <Field label="Country code" hint="e.g. GB, US, CZ">
            <input className={inputClass} value={form.countryCode} onChange={(e) => set("countryCode", e.target.value.toUpperCase())} maxLength={2} />
          </Field>
        </div>
        <Field label="Short description">
          <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Long overview">
          <textarea className={inputClass} rows={5} value={form.longOverview} onChange={(e) => set("longOverview", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CEO name">
            <input className={inputClass} value={form.ceoName} onChange={(e) => set("ceoName", e.target.value)} />
          </Field>
          <Field label="Founded date">
            <input className={inputClass} type="date" value={form.foundedAt} onChange={(e) => set("foundedAt", e.target.value)} />
          </Field>
        </div>
        <Field label="Logo URL">
          <input className={inputClass} value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-4">
          <Check label="Published" checked={form.published} onChange={(v) => set("published", v)} />
          <Check label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
          <Check label="NEW badge" checked={form.isNew} onChange={(v) => set("isNew", v)} />
        </div>
      </Section>

      <Section title="Trading & metrics">
        <Field label="Assets" hint="Comma-separated: forex,crypto,indices">
          <input className={inputClass} value={form.assetTypes} onChange={(e) => set("assetTypes", e.target.value)} />
        </Field>
        <Field label="Platforms" hint="Comma-separated: mt5,ctrader,matchtrader">
          <input className={inputClass} value={form.platforms} onChange={(e) => set("platforms", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Profit split"><input className={inputClass} value={form.profitSplit} onChange={(e) => set("profitSplit", e.target.value)} /></Field>
          <Field label="Max drawdown"><input className={inputClass} value={form.maxDrawdown} onChange={(e) => set("maxDrawdown", e.target.value)} /></Field>
          <Field label="Drawdown types"><input className={inputClass} value={form.drawdownTypes} onChange={(e) => set("drawdownTypes", e.target.value)} /></Field>
          <Field label="Max allocation"><input className={inputClass} placeholder="$200K" value={form.maxAllocation} onChange={(e) => set("maxAllocation", e.target.value)} /></Field>
          <Field label="Starting price"><input className={inputClass} placeholder="$59" value={form.startingPrice} onChange={(e) => set("startingPrice", e.target.value)} /></Field>
          <Field label="Payout speed"><input className={inputClass} placeholder="On demand" value={form.payoutSpeed} onChange={(e) => set("payoutSpeed", e.target.value)} /></Field>
          <Field label="Min fee ($)"><input className={inputClass} type="number" value={form.minFee} onChange={(e) => set("minFee", e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Coupon & links">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Discount %"><input className={inputClass} type="number" min={0} max={100} value={form.discountPercent} onChange={(e) => set("discountPercent", e.target.value)} /></Field>
          <Field label="Coupon code"><input className={`${inputClass} font-mono uppercase`} value={form.discountCode} onChange={(e) => set("discountCode", e.target.value.toUpperCase())} /></Field>
        </div>
        <Field label="Website URL"><input className={inputClass} type="url" value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} /></Field>
        <Field label="Affiliate URL"><input className={inputClass} type="url" value={form.affiliateUrl} onChange={(e) => set("affiliateUrl", e.target.value)} /></Field>
      </Section>

      <Section title="Pros & cons" hint="One item per line">
        <Field label="Pros">
          <textarea className={inputClass} rows={4} value={form.prosText} onChange={(e) => set("prosText", e.target.value)} />
        </Field>
        <Field label="Cons">
          <textarea className={inputClass} rows={4} value={form.consText} onChange={(e) => set("consText", e.target.value)} />
        </Field>
      </Section>

      <Section title="Trading features">
        <div className="grid gap-3 sm:grid-cols-2">
          <Check label="News trading allowed" checked={form.newsTrading} onChange={(v) => set("newsTrading", v)} />
          <Check label="Weekend holding" checked={form.weekendHolding} onChange={(v) => set("weekendHolding", v)} />
          <Check label="Expert advisors (EA)" checked={form.expertAdvisors} onChange={(v) => set("expertAdvisors", v)} />
          <Check label="Copy trading" checked={form.copyTrading} onChange={(v) => set("copyTrading", v)} />
          <Check label="No time limit" checked={form.noTimeLimit} onChange={(v) => set("noTimeLimit", v)} />
          <Check label="Consistency rule applies" checked={form.consistencyRule} onChange={(v) => set("consistencyRule", v)} />
        </div>
      </Section>

      <button type="submit" disabled={loading} className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50">
        {loading ? "Saving…" : isEdit ? "Save changes" : "Create firm"}
      </button>
    </form>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
      <legend className="px-1 text-sm font-semibold text-zinc-900">{title}</legend>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      {children}
    </fieldset>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}{required && " *"}</label>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

const inputClass = "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
