import Link from "next/link";
import { AdminNav } from "./admin-nav";

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-900 px-4 py-6 text-white">
        <Link href="/admin" className="text-lg font-bold tracking-tight">
          PropCompare
        </Link>
        <p className="mt-1 text-xs text-zinc-500">Admin panel</p>
        <div className="mt-8 flex-1">
          <AdminNav />
        </div>
        <Link
          href="/"
          className="mt-6 block rounded-lg border border-zinc-700 px-3 py-2 text-center text-sm text-zinc-300 hover:bg-zinc-800"
        >
          ← Back to site
        </Link>
      </aside>
      <div className="flex flex-1 flex-col">
        {title && (
          <header className="border-b border-zinc-200 bg-white px-8 py-5">
            <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
          </header>
        )}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
