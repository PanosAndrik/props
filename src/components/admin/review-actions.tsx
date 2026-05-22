"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { approveReview, rejectReview } from "@/lib/actions/moderate-review";

export function AdminReviewActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");

  function run(action: "approve" | "reject") {
    setError("");
    setActive(action);
    startTransition(async () => {
      try {
        if (action === "approve") {
          await approveReview(reviewId);
        } else {
          await rejectReview(reviewId);
        }
        router.refresh();
      } catch {
        setError("Action failed. Try again.");
      } finally {
        setActive(null);
      }
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => run("approve")}
          aria-label="Approve review"
          className="min-w-[88px] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {active === "approve" ? "…" : "✓ Approve"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run("reject")}
          aria-label="Reject review"
          className="min-w-[88px] rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {active === "reject" ? "…" : "✕ Reject"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
