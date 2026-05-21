import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
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
          <Link href="/blog" className="hover:text-zinc-900">
            Blog
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-amber-700 hover:text-amber-900">
              Admin
            </Link>
          )}
          {session ? (
            <span className="text-zinc-500">{session.user?.email}</span>
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
