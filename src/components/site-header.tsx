import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/user-menu";

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-zinc-900">
          PropCompare
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
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
          {session ? (
            <UserMenu email={session.user?.email} isAdmin={isAdmin} />
          ) : (
            <>
              <Link href="/auth/signin" className="hover:text-zinc-900">
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
