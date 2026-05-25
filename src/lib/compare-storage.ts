export const COMPARE_STORAGE_KEY = "propcompare_compare";
export const MAX_COMPARE = 3;

export function getCompareSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

export function setCompareSlugs(slugs: string[]) {
  const next = slugs.slice(0, MAX_COMPARE);
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("compare-updated"));
  return next;
}

export function toggleCompareSlug(slug: string): { slugs: string[]; added: boolean; full: boolean } {
  const cur = getCompareSlugs();
  if (cur.includes(slug)) {
    return { slugs: setCompareSlugs(cur.filter((s) => s !== slug)), added: false, full: false };
  }
  if (cur.length >= MAX_COMPARE) {
    return { slugs: cur, added: false, full: true };
  }
  return { slugs: setCompareSlugs([...cur, slug]), added: true, full: false };
}

export function compareHref(slugs: string[]) {
  if (slugs.length < 2) return "/compare";
  return `/compare?firms=${slugs.join(",")}`;
}
