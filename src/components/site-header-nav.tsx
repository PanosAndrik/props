"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignOutButton } from "./sign-out-button";

type Props = {
  isLoggedIn: boolean;
  email?: string | null;
  isAdmin?: boolean;
};

const links = [
  { href: "/firms", label: "Firms" },
  { href: "/compare", label: "Compare" },
  { href: "/deals", label: "Deals" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

function navLinkClass(active: boolean, mobile?: boolean) {
  if (mobile) {
    return active
      ? "font-semibold text-zinc-900"
      : "text-zinc-600 hover:text-zinc-900";
  }
  return active
    ? "text-zinc-900 md:border-b-2 md:border-zinc-900 md:pb-0.5"
    : "text-zinc-600 hover:text-zinc-900 md:text-sm md:font-medium";
}

export function SiteHeaderNav({ isLoggedIn, email, isAdmin }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  const navLinks = (
    <>
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={close}
          className={navLinkClass(isActive(item.href), true)}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  const authBlock = isLoggedIn ? (
    <>
      <Link href="/account" onClick={close} className="text-zinc-600 hover:text-zinc-900">
        Account
      </Link>
      {email && (
        <span className="text-xs text-zinc-400 md:max-w-[140px] md:truncate" title={email}>
          {email}
        </span>
      )}
      {isAdmin && (
        <Link href="/admin" onClick={close} className="font-medium text-amber-700 hover:text-amber-900">
          Admin
        </Link>
      )}
      <SignOutButton className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 md:w-auto md:px-3 md:py-1.5" />
    </>
  ) : (
    <>
      <Link href="/auth/signin" onClick={close} className="text-zinc-600 hover:text-zinc-900">
        Sign in
      </Link>
      <Link
        href="/auth/signup"
        onClick={close}
        className="inline-flex justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Sign up
      </Link>
    </>
  );

  return (
    <>
      <nav className="hidden items-center gap-5 md:flex">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={navLinkClass(isActive(item.href))}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="hidden items-center gap-4 md:flex">{authBlock}</div>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 md:hidden"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/40"
            aria-label="Close menu"
            onClick={close}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
              <span className="font-bold text-zinc-900">Menu</span>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-4 px-4 py-6 text-base font-medium">{navLinks}</nav>
            <div className="mt-auto flex flex-col gap-4 border-t border-zinc-200 px-4 py-6">{authBlock}</div>
          </div>
        </div>
      )}
    </>
  );
}
