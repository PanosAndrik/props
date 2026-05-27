import { parseList } from "@/lib/firm-utils";

export function trustScoreLabel(score: number): string {
  if (score >= 90) return "EXCELLENT";
  if (score >= 75) return "GOOD";
  if (score >= 60) return "FAIR";
  return "REVIEW";
}

export function formatFoundedYear(date: Date | null | undefined): string | null {
  if (!date) return null;
  return String(date.getFullYear());
}

export type AssetTagStyle = { label: string; className: string };

const ASSET_STYLES: Record<string, string> = {
  forex: "border-blue-500 text-blue-700 bg-blue-50",
  crypto: "border-emerald-500 text-emerald-700 bg-emerald-50",
  indices: "border-violet-500 text-violet-700 bg-violet-50",
  commodities: "border-amber-500 text-amber-700 bg-amber-50",
  futures: "border-orange-500 text-orange-700 bg-orange-50",
  stocks: "border-zinc-500 text-zinc-700 bg-zinc-50",
};

export function assetTags(assetTypes: string): AssetTagStyle[] {
  return parseList(assetTypes).map((a) => ({
    label: a.charAt(0).toUpperCase() + a.slice(1),
    className: ASSET_STYLES[a.toLowerCase()] ?? "border-zinc-400 text-zinc-700 bg-zinc-50",
  }));
}

export function featureLabel(
  key: string,
  value: boolean,
  opts?: { restrictedWhenTrue?: boolean; customTrue?: string; customFalse?: string }
): string {
  if (opts?.customTrue || opts?.customFalse) {
    return value ? (opts.customTrue ?? "Yes") : (opts.customFalse ?? "No");
  }
  if (opts?.restrictedWhenTrue) {
    return value ? "Restricted" : "Allowed";
  }
  return value ? "Yes" : "No";
}
