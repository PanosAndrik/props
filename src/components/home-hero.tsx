"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeHero({
  isAdmin,
  isLoggedIn,
  userName,
}: {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  userName?: string | null;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    router.push(trimmed ? `/firms?q=${encodeURIComponent(trimmed)}` : "/firms");
  }

  return (
    <section className="border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-4 py-4 sm:py-5">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Prop firm comparison platform
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
              Find & compare trusted prop firms
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              {isAdmin
                ? "Manage firms, reviews, and content."
                : isLoggedIn
                  ? `Welcome back${userName ? `, ${userName}` : ""}.`
                  : "Reviews, coupon codes, and side-by-side comparisons."}
            </p>
            <form onSubmit={onSearch} className="mt-3 flex max-w-xl gap-2">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search firms, e.g. FTMO…"
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Search
              </button>
            </form>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/firms"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Browse firms
            </Link>
            <Link
              href="/compare"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              Compare
            </Link>
            {isAdmin ? (
              <Link
                href="/admin"
                className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900"
              >
                Admin
              </Link>
            ) : isLoggedIn ? (
              <Link
                href="/account"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
              >
                Sign up
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
