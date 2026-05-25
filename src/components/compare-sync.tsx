"use client";

import { useEffect } from "react";
import { setCompareSlugs } from "@/lib/compare-storage";

/** Persist URL compare selection to localStorage for the compare bar. */
export function CompareSync({ slugs }: { slugs: string[] }) {
  useEffect(() => {
    if (slugs.length > 0) {
      setCompareSlugs(slugs);
    }
  }, [slugs.join(",")]);
  return null;
}
