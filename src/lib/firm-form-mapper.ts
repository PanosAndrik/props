import type { PropFirm } from "@prisma/client";
import { listToJsonArray, parseJsonList, parseList } from "@/lib/firm-utils";

export type FirmFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  longOverview: string;
  websiteUrl: string;
  affiliateUrl: string;
  discountCode: string;
  discountPercent: string;
  logoUrl: string;
  countryCode: string;
  ceoName: string;
  foundedAt: string;
  category: string;
  assetTypes: string;
  platforms: string;
  profitSplit: string;
  maxDrawdown: string;
  drawdownTypes: string;
  minFee: string;
  maxAllocation: string;
  startingPrice: string;
  payoutSpeed: string;
  prosText: string;
  consText: string;
  rankOrder: string;
  isNew: boolean;
  featured: boolean;
  published: boolean;
  newsTrading: boolean;
  weekendHolding: boolean;
  expertAdvisors: boolean;
  copyTrading: boolean;
  noTimeLimit: boolean;
  consistencyRule: boolean;
};

export const emptyFirmForm: FirmFormState = {
  name: "",
  slug: "",
  description: "",
  longOverview: "",
  websiteUrl: "",
  affiliateUrl: "",
  discountCode: "",
  discountPercent: "",
  logoUrl: "",
  countryCode: "",
  ceoName: "",
  foundedAt: "",
  category: "forex",
  assetTypes: "forex,crypto",
  platforms: "",
  profitSplit: "",
  maxDrawdown: "",
  drawdownTypes: "",
  minFee: "",
  maxAllocation: "",
  startingPrice: "",
  payoutSpeed: "",
  prosText: "",
  consText: "",
  rankOrder: "999",
  isNew: false,
  featured: false,
  published: true,
  newsTrading: false,
  weekendHolding: false,
  expertAdvisors: false,
  copyTrading: false,
  noTimeLimit: false,
  consistencyRule: false,
};

export function firmToForm(firm: PropFirm): FirmFormState {
  return {
    id: firm.id,
    name: firm.name,
    slug: firm.slug,
    description: firm.description ?? "",
    longOverview: firm.longOverview ?? "",
    websiteUrl: firm.websiteUrl ?? "",
    affiliateUrl: firm.affiliateUrl ?? "",
    discountCode: firm.discountCode ?? "",
    discountPercent: firm.discountPercent?.toString() ?? "",
    logoUrl: firm.logoUrl ?? "",
    countryCode: firm.countryCode ?? "",
    ceoName: firm.ceoName ?? "",
    foundedAt: firm.foundedAt ? firm.foundedAt.toISOString().slice(0, 10) : "",
    category: firm.category,
    assetTypes: firm.assetTypes,
    platforms: firm.platforms,
    profitSplit: firm.profitSplit ?? "",
    maxDrawdown: firm.maxDrawdown ?? "",
    drawdownTypes: firm.drawdownTypes ?? "",
    minFee: firm.minFee?.toString() ?? "",
    maxAllocation: firm.maxAllocation ?? "",
    startingPrice: firm.startingPrice ?? "",
    payoutSpeed: firm.payoutSpeed ?? "",
    prosText: parseJsonList(firm.pros).join("\n"),
    consText: parseJsonList(firm.cons).join("\n"),
    rankOrder: firm.rankOrder.toString(),
    isNew: firm.isNew,
    featured: firm.featured,
    published: firm.published,
    newsTrading: firm.newsTrading,
    weekendHolding: firm.weekendHolding,
    expertAdvisors: firm.expertAdvisors,
    copyTrading: firm.copyTrading,
    noTimeLimit: firm.noTimeLimit,
    consistencyRule: firm.consistencyRule,
  };
}

export function formToPayload(form: FirmFormState) {
  return {
    name: form.name,
    slug: form.slug || undefined,
    description: form.description || null,
    longOverview: form.longOverview || null,
    websiteUrl: form.websiteUrl || null,
    affiliateUrl: form.affiliateUrl || null,
    discountCode: form.discountCode || null,
    discountPercent: form.discountPercent ? Number(form.discountPercent) : null,
    logoUrl: form.logoUrl || null,
    countryCode: form.countryCode || null,
    ceoName: form.ceoName || null,
    foundedAt: form.foundedAt || null,
    category: form.category,
    assetTypes: form.assetTypes,
    platforms: form.platforms,
    profitSplit: form.profitSplit || null,
    maxDrawdown: form.maxDrawdown || null,
    drawdownTypes: form.drawdownTypes || null,
    minFee: form.minFee ? Number(form.minFee) : null,
    maxAllocation: form.maxAllocation || null,
    startingPrice: form.startingPrice || null,
    payoutSpeed: form.payoutSpeed || null,
    pros: form.prosText.trim() ? listToJsonArray(parseList(form.prosText)) : null,
    cons: form.consText.trim() ? listToJsonArray(parseList(form.consText)) : null,
    rankOrder: Number(form.rankOrder) || 999,
    isNew: form.isNew,
    featured: form.featured,
    published: form.published,
    newsTrading: form.newsTrading,
    weekendHolding: form.weekendHolding,
    expertAdvisors: form.expertAdvisors,
    copyTrading: form.copyTrading,
    noTimeLimit: form.noTimeLimit,
    consistencyRule: form.consistencyRule,
  };
}
