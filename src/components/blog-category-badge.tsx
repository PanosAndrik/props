import { categoryStyle } from "@/lib/blog-meta";

export function BlogCategoryBadge({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold ${categoryStyle(category)} ${className}`}
    >
      {category}
    </span>
  );
}
