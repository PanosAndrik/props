"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewsletterCta({
  title,
  subtitle,
  isLoggedIn,
}: {
  title: string;
  subtitle: string;
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (isLoggedIn) {
      router.push("/account");
      return;
    }
    if (trimmed) {
      router.push(`/auth/signup?email=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/auth/signup");
    }
  }

  return (
    <section className="border-t border-zinc-200 bg-zinc-100/80 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="section-title">{title}</h2>
        <p className="mt-2 text-muted sm:text-base">{subtitle}</p>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm"
            disabled={isLoggedIn}
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            {isLoggedIn ? "Go to account →" : "Create free account →"}
          </button>
        </form>

        {!isLoggedIn && (
          <p className="mt-4 text-xs text-zinc-500">
            ✓ Free forever · ✓ No spam · ✓ Unsubscribe anytime
          </p>
        )}
      </div>
    </section>
  );
}
