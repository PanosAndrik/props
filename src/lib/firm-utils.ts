export function parseList(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function listToJsonArray(items: string[]): string {
  return JSON.stringify(items.filter(Boolean));
}

export function parseJsonList(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return parseList(value);
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  UK: "United Kingdom",
  HK: "Hong Kong",
  AE: "UAE",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  NL: "Netherlands",
  CH: "Switzerland",
  GR: "Greece",
};

export function countryLabel(code: string | null | undefined): string {
  if (!code) return "—";
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] ?? upper;
}

export function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🌐";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

export function yearsInOperation(foundedAt: Date | null | undefined): string {
  if (!foundedAt) return "—";
  const years = Math.floor(
    (Date.now() - foundedAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  if (years < 1) return "<1";
  if (years >= 10) return "10+";
  return String(years);
}

export function avgRating(ratings: { rating: number }[]): number | null {
  if (ratings.length === 0) return null;
  return ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
}

export const PLATFORM_LABELS: Record<string, string> = {
  mt4: "MT4",
  mt5: "MT5",
  ctrader: "cTrader",
  matchtrader: "Match-Trader",
  dxtrade: "DXTrade",
  tradelocker: "TradeLocker",
};

export function platformLabel(key: string): string {
  return PLATFORM_LABELS[key.toLowerCase()] ?? key;
}
