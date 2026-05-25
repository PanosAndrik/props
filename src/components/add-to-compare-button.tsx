"use client";

import { useEffect, useState } from "react";
import { getCompareSlugs, toggleCompareSlug } from "@/lib/compare-storage";
import { useToast } from "@/components/toast-provider";

export function AddToCompareButton({
  slug,
  firmName,
  className = "",
}: {
  slug: string;
  firmName: string;
  className?: string;
}) {
  const toast = useToast();
  const [selected, setSelected] = useState(false);

  function refresh() {
    setSelected(getCompareSlugs().includes(slug));
  }

  useEffect(() => {
    refresh();
    window.addEventListener("compare-updated", refresh);
    return () => window.removeEventListener("compare-updated", refresh);
  }, [slug]);

  function onClick() {
    const { added, full, slugs } = toggleCompareSlug(slug);
    setSelected(slugs.includes(slug));
    if (full) {
      toast("You can compare up to 3 firms. Remove one first.");
      return;
    }
    if (added) {
      toast(`${firmName} added to compare (${slugs.length}/3)`);
    } else {
      toast(`${firmName} removed from compare`);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ||
        `rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          selected
            ? "border-amber-400 bg-amber-50 text-amber-900"
            : "border-zinc-300 text-zinc-800 hover:bg-zinc-50"
        }`
      }
    >
      {selected ? "In compare ✓" : "Add to compare"}
    </button>
  );
}
