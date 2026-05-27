import Link from "next/link";
import { auth } from "@/lib/auth";
import { SiteHeaderNav } from "@/components/site-header-nav";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 min-w-0 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16">
        <Link
          href="/"
          className="brand-title shrink-0"
        >
          PropCompare
        </Link>
        <SiteHeaderNav
          isLoggedIn={!!session}
          email={session?.user?.email}
          isAdmin={session?.user?.role === "ADMIN"}
        />
      </div>
    </header>
  );
}
