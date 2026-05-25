"use client";

import { useToast } from "@/components/toast-provider";

export function CompareShareButton({ path }: { path: string }) {
  const toast = useToast();

  async function copy() {
    try {
      const url = `${window.location.origin}${path}`;
      await navigator.clipboard.writeText(url);
      toast("Comparison link copied");
    } catch {
      toast("Could not copy link");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
    >
      Copy share link
    </button>
  );
}
