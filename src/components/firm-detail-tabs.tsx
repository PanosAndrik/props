"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export type FirmTab = "overview" | "challenges" | "reviews";

const tabs: { id: FirmTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "challenges", label: "Challenges" },
  { id: "reviews", label: "Reviews" },
];

export function FirmDetailTabs({
  slug,
  challengeCount,
  reviewCount,
}: {
  slug: string;
  challengeCount: number;
  reviewCount: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("tab");
  const active: FirmTab =
    raw === "challenges" || raw === "reviews" ? raw : "overview";

  function href(tab: FirmTab) {
    if (tab === "overview") return pathname;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    return `${pathname}?${params.toString()}`;
  }

  function label(tab: (typeof tabs)[number]) {
    if (tab.id === "challenges" && challengeCount > 0) {
      return `${tab.label} (${challengeCount})`;
    }
    if (tab.id === "reviews" && reviewCount > 0) {
      return `${tab.label} (${reviewCount})`;
    }
    return tab.label;
  }

  return (
    <nav className="mt-8 flex flex-wrap gap-1 border-b border-zinc-200">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={href(tab.id)}
          className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            active === tab.id
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {label(tab)}
        </Link>
      ))}
    </nav>
  );
}
