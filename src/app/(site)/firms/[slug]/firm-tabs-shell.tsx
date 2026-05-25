"use client";

import { Suspense } from "react";
import { FirmDetailTabs } from "@/components/firm-detail-tabs";

export function FirmTabsShell({
  slug,
  challengeCount,
  reviewCount,
}: {
  slug: string;
  challengeCount: number;
  reviewCount: number;
}) {
  return (
    <Suspense fallback={<div className="mt-8 h-12 border-b border-zinc-200" />}>
      <FirmDetailTabs
        slug={slug}
        challengeCount={challengeCount}
        reviewCount={reviewCount}
      />
    </Suspense>
  );
}
