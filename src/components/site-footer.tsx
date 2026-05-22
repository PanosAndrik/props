import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} PropCompare</p>
        <nav className="flex flex-wrap gap-6">
          <Link href="/firms" className="hover:text-zinc-900">
            Firms
          </Link>
          <Link href="/compare" className="hover:text-zinc-900">
            Compare
          </Link>
          <Link href="/blog" className="hover:text-zinc-900">
            Blog
          </Link>
          <Link href="/about" className="hover:text-zinc-900">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
