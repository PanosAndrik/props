"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { compareHref, getCompareSlugs, setCompareSlugs } from "@/lib/compare-storage";
import { useToast } from "@/components/toast-provider";

type FirmOption = { slug: string; name: string };

export function ComparePicker({ firms }: { firms: FirmOption[] }) {
  const router = useRouter();
  const toast = useToast();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(getCompareSlugs());
    const onUpdate = () => setSelected(getCompareSlugs());
    window.addEventListener("compare-updated", onUpdate);
    return () => window.removeEventListener("compare-updated", onUpdate);
  }, []);

  function toggle(slug: string) {
    const cur = getCompareSlugs();
    let next: string[];
    if (cur.includes(slug)) {
      next = cur.filter((s) => s !== slug);
    } else if (cur.length >= 3) {
      toast("You can compare up to 3 firms. Remove one first.");
      return;
    } else {
      next = [...cur, slug];
    }
    setCompareSlugs(next);
    setSelected(next);
  }

  function compare() {
    if (selected.length < 2) return;
    router.push(compareHref(selected));
  }

  return (
    <div className="mt-8">
      <p className="text-body-sm">
        Select 2–3 firms to compare side by side ({selected.length}/3 selected). Selection is
        saved in your browser.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {firms.map((firm) => {
          const checked = selected.includes(firm.slug);
          const disabled = !checked && selected.length >= 3;
          return (
            <li key={firm.slug}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${
                  checked
                    ? "border-amber-400 bg-amber-50"
                    : disabled
                      ? "cursor-not-allowed border-zinc-100 opacity-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(firm.slug)}
                />
                <span className="font-medium">{firm.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={compare}
        disabled={selected.length < 2}
        className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40"
      >
        Compare selected
      </button>
    </div>
  );
}
