"use client";

import { useState } from "react";
import { useToast } from "@/components/toast-provider";

export function CopyCouponButton({
  code,
  compact,
}: {
  code: string;
  compact?: boolean;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast("Coupon copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not copy — select the code manually");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        compact
          ? "rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] font-medium text-zinc-800 hover:bg-zinc-100 sm:text-xs"
          : "rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
      }
    >
      {copied ? "Copied!" : compact ? "Copy" : "Copy code"}
    </button>
  );
}
