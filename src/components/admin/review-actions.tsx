"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminReviewActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(status: "APPROVED" | "REJECTED") {
    setLoading(status);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={!!loading}
        onClick={() => updateStatus("APPROVED")}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading === "APPROVED" ? "…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={!!loading}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      >
        {loading === "REJECTED" ? "…" : "Reject"}
      </button>
    </div>
  );
}
