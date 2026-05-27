"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminNav } from "./admin-nav";
import { SignOutButton } from "@/components/sign-out-button";

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen min-w-0 bg-zinc-100">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-zinc-900/50 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-900 px-4 py-6 text-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/admin" className="brand-title" onClick={() => setSidebarOpen(false)}>
          PropCompare
        </Link>
        <p className="mt-1 text-xs text-zinc-500">Admin panel</p>
        <div className="mt-8 flex-1">
          <AdminNav />
        </div>
        <div className="mt-6 space-y-2">
          <Link
            href="/"
            className="block rounded-lg border border-zinc-700 px-3 py-2 text-center text-sm text-zinc-300 hover:bg-zinc-800"
          >
            ← Back to site
          </Link>
          <SignOutButton variant="admin" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-4 lg:px-8">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          {title && <h1 className="page-title">{title}</h1>}
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
