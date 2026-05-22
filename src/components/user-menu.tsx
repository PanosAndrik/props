"use client";

import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export function UserMenu({ email, isAdmin }: { email?: string | null; isAdmin?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="text-zinc-600 hover:text-zinc-900"
      >
        Account
      </Link>
      <span
        className="max-w-[140px] truncate text-zinc-400"
        title={email ?? undefined}
      >
        {email}
      </span>
      {isAdmin && (
        <Link href="/admin" className="text-amber-700 hover:text-amber-900">
          Admin
        </Link>
      )}
      <SignOutButton />
    </div>
  );
}
