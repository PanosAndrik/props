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
  instantFunded: boolean;
  showInOffers: boolean;
  brandColor: string;
  legalName: string;
  headquarters: string;
  trustScore: string;
  verified: boolean;
  referralStats: string;
  incentiveText: string;
  challengeTypes: string;
  maxChallengeFee: string;
  profitTargetP1: string;
  profitTargetP2: string;
  payoutFrequency: string;
  brokerName: string;
  dailyDrawdown: string;
  minTradingDays: string;
  maxTradingDays: string;
  scalingPlan: string;
  swapFree: string;
  drawdownExplained: string;
  rulesDetail: string;
  payoutsDetail: string;
  faqJson: string;
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
  instantFunded: false,
  showInOffers: false,
  brandColor: "",
  legalName: "",
  headquarters: "",
  trustScore: "",
  verified: false,
  referralStats: "",
  incentiveText: "",
  challengeTypes: "",
  maxChallengeFee: "",
  profitTargetP1: "",
  profitTargetP2: "",
  payoutFrequency: "",
  brokerName: "",
  dailyDrawdown: "",
  minTradingDays: "",
  maxTradingDays: "",
  scalingPlan: "",
  swapFree: "",
  drawdownExplained: "",
  rulesDetail: "",
  payoutsDetail: "",
  faqJson: "",
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
    instantFunded: firm.instantFunded,
    showInOffers: firm.showInOffers,
    brandColor: firm.brandColor ?? "",
    legalName: firm.legalName ?? "",
    headquarters: firm.headquarters ?? "",
    trustScore: firm.trustScore?.toString() ?? "",
    verified: firm.verified,
    referralStats: firm.referralStats ?? "",
    incentiveText: firm.incentiveText ?? "",
    challengeTypes: firm.challengeTypes ?? "",
    maxChallengeFee: firm.maxChallengeFee?.toString() ?? "",
    profitTargetP1: firm.profitTargetP1 ?? "",
    profitTargetP2: firm.profitTargetP2 ?? "",
    payoutFrequency: firm.payoutFrequency ?? "",
    brokerName: firm.brokerName ?? "",
    dailyDrawdown: firm.dailyDrawdown ?? "",
    minTradingDays: firm.minTradingDays ?? "",
    maxTradingDays: firm.maxTradingDays ?? "",
    scalingPlan: firm.scalingPlan ?? "",
    swapFree: firm.swapFree ?? "",
    drawdownExplained: firm.drawdownExplained ?? "",
    rulesDetail: firm.rulesDetail ?? "",
    payoutsDetail: firm.payoutsDetail ?? "",
    faqJson: firm.faqJson ?? "",
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
    instantFunded: form.instantFunded,
    showInOffers: form.showInOffers,
    brandColor: form.brandColor || null,
    legalName: form.legalName || null,
    headquarters: form.headquarters || null,
    trustScore: form.trustScore ? Number(form.trustScore) : null,
    verified: form.verified,
    referralStats: form.referralStats || null,
    incentiveText: form.incentiveText || null,
    challengeTypes: form.challengeTypes || null,
    maxChallengeFee: form.maxChallengeFee ? Number(form.maxChallengeFee) : null,
    profitTargetP1: form.profitTargetP1 || null,
    profitTargetP2: form.profitTargetP2 || null,
    payoutFrequency: form.payoutFrequency || null,
    brokerName: form.brokerName || null,
    dailyDrawdown: form.dailyDrawdown || null,
    minTradingDays: form.minTradingDays || null,
    maxTradingDays: form.maxTradingDays || null,
    scalingPlan: form.scalingPlan || null,
    swapFree: form.swapFree || null,
    drawdownExplained: form.drawdownExplained || null,
    rulesDetail: form.rulesDetail || null,
    payoutsDetail: form.payoutsDetail || null,
    faqJson: form.faqJson.trim() || null,
    profileUpdatedAt: new Date(),
  };
}
