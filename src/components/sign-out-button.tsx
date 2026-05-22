"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "admin";
}) {
  const styles =
    variant === "admin"
      ? "w-full rounded-lg border border-zinc-700 px-3 py-2 text-center text-sm text-zinc-300 hover:bg-zinc-800"
      : "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50";

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className ?? styles}
    >
      Sign out
    </button>
  );
}
