"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  emptyChallengeForm,
  formToPayload,
  type ChallengeFormState,
} from "@/lib/challenge-form-mapper";

export type { ChallengeFormState } from "@/lib/challenge-form-mapper";

const inputClass =
  "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export function ChallengeForm({
  firmId,
  initial,
  backHref,
}: {
  firmId: string;
  initial?: ChallengeFormState;
  backHref: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ChallengeFormState>({ ...emptyChallengeForm, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!initial?.id;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit
      ? `/api/admin/challenges/${initial!.id}`
      : `/api/admin/firms/${firmId}/challenges`;
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
    router.push(backHref);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label className="form-label">Challenge name *</label>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          placeholder="2-Step $100K"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label">Account size</label>
          <input
            className={inputClass}
            value={form.accountSize}
            onChange={(e) => setForm((f) => ({ ...f, accountSize: e.target.value }))}
            placeholder="$100K"
          />
        </div>
        <div>
          <label className="form-label">Price ($)</label>
          <input
            className={inputClass}
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>
        <div>
          <label className="form-label">Profit target</label>
          <input
            className={inputClass}
            value={form.profitTarget}
            onChange={(e) => setForm((f) => ({ ...f, profitTarget: e.target.value }))}
            placeholder="10%"
          />
        </div>
        <div>
          <label className="form-label">Max drawdown</label>
          <input
            className={inputClass}
            value={form.maxDrawdown}
            onChange={(e) => setForm((f) => ({ ...f, maxDrawdown: e.target.value }))}
            placeholder="10%"
          />
        </div>
        <div>
          <label className="form-label">Profit split</label>
          <input
            className={inputClass}
            value={form.profitSplit}
            onChange={(e) => setForm((f) => ({ ...f, profitSplit: e.target.value }))}
            placeholder="80/20"
          />
        </div>
        <div>
          <label className="form-label">Sort order</label>
          <input
            className={inputClass}
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
        />
        Published on firm page
      </label>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create challenge"}
        </button>
        <a
          href={backHref}
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
