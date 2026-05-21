"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminReviewActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: "APPROVED" | "REJECTED") {
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("APPROVED")}
        className="rounded-full bg-green-700 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-full bg-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-800 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
