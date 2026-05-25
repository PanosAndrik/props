import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/blog-meta";

export function BlogCategoryPills({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
          !active
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
        }`}
      >
        All
      </Link>
      {BLOG_CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={`/blog?category=${encodeURIComponent(cat)}`}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
            active === cat
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
