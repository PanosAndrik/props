export const BLOG_CATEGORIES = [
  "Comparison",
  "Guide",
  "Tutorial",
  "Deals",
  "Rankings",
  "News",
] as const;

export const BLOG_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

const CATEGORY_STYLES: Record<string, string> = {
  Comparison: "border-blue-500 text-blue-700",
  Guide: "border-emerald-500 text-emerald-700",
  Tutorial: "border-orange-500 text-orange-700",
  Deals: "border-red-500 text-red-700",
  Rankings: "border-sky-500 text-sky-700",
  News: "border-zinc-500 text-zinc-700",
};

export function categoryStyle(category: string | null | undefined) {
  if (!category) return "border-zinc-400 text-zinc-600";
  return CATEGORY_STYLES[category] ?? "border-zinc-400 text-zinc-600";
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const OFFER_COLORS = ["blue", "green", "orange", "purple"] as const;

export function offerColorClasses(color: string | null | undefined, index: number) {
  const key = color ?? OFFER_COLORS[index % OFFER_COLORS.length];
  const map: Record<string, { border: string; bg: string; btn: string; code: string }> = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      btn: "bg-blue-600 hover:bg-blue-700",
      code: "text-blue-800",
    },
    green: {
      border: "border-emerald-500",
      bg: "bg-emerald-50",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      code: "text-emerald-800",
    },
    orange: {
      border: "border-orange-500",
      bg: "bg-orange-50",
      btn: "bg-orange-600 hover:bg-orange-700",
      code: "text-orange-800",
    },
    purple: {
      border: "border-violet-500",
      bg: "bg-violet-50",
      btn: "bg-violet-600 hover:bg-violet-700",
      code: "text-violet-800",
    },
  };
  return map[key] ?? map.blue;
}
