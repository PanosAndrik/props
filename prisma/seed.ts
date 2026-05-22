import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const prosFtmo = JSON.stringify([
  "Well-known brand and large community",
  "Clear rules and scaling plan",
  "Multiple account sizes",
]);
const consFtmo = JSON.stringify([
  "Stricter consistency on some programs",
  "Challenge fee on the higher side",
]);

async function main() {
  const adminHash = await bcrypt.hash("admin123", 12);
  const demoHash = await bcrypt.hash("demo123", 12);

  await prisma.user.upsert({
    where: { email: "admin@prop.local" },
    update: {},
    create: {
      email: "admin@prop.local",
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@prop.local" },
    update: {},
    create: {
      email: "demo@prop.local",
      name: "Demo Trader",
      passwordHash: demoHash,
      role: "USER",
    },
  });

  const firms = [
    {
      name: "FTMO",
      slug: "ftmo",
      rankOrder: 1,
      countryCode: "CZ",
      ceoName: "Ondřej Hartman",
      foundedAt: new Date("2015-01-01"),
      category: "forex",
      description:
        "One of the most popular prop firms. Forex and indices challenges with clear rules.",
      longOverview:
        "FTMO is a Czech-based proprietary trading firm offering evaluation programs for forex and indices traders. Known for transparent rules and regular payouts.",
      websiteUrl: "https://ftmo.com",
      affiliateUrl: "https://ftmo.com",
      discountCode: "PROP10",
      discountPercent: 10,
      assetTypes: "forex,indices,commodities",
      platforms: "mt4,mt5,ctrader",
      profitSplit: "80-90%",
      maxDrawdown: "10%",
      drawdownTypes: "Balance drawdown",
      minFee: 155,
      maxAllocation: "$400K",
      startingPrice: "$155",
      payoutSpeed: "Bi-weekly",
      featured: true,
      isNew: false,
      noTimeLimit: true,
      expertAdvisors: true,
      pros: prosFtmo,
      cons: consFtmo,
    },
    {
      name: "Funding Pips",
      slug: "funding-pips",
      rankOrder: 2,
      countryCode: "AE",
      foundedAt: new Date("2022-06-01"),
      category: "forex",
      description: "Fast-growing firm with multiple challenge types and competitive pricing.",
      longOverview:
        "Funding Pips offers instant and evaluation-style programs with competitive profit splits and frequent promotions.",
      websiteUrl: "https://fundingpips.com",
      discountCode: "FUNDING5",
      discountPercent: 50,
      assetTypes: "forex,crypto,indices",
      platforms: "mt5,matchtrader",
      profitSplit: "80-100%",
      maxDrawdown: "8-10%",
      minFee: 59,
      maxAllocation: "$300K",
      startingPrice: "$59",
      payoutSpeed: "On demand",
      featured: true,
      isNew: true,
      newsTrading: true,
      weekendHolding: true,
    },
    {
      name: "The5ers",
      slug: "the5ers",
      rankOrder: 3,
      countryCode: "IL",
      foundedAt: new Date("2016-01-01"),
      category: "forex",
      description: "Established prop firm with bootcamp and high-stakes programs.",
      websiteUrl: "https://the5ers.com",
      discountCode: "FIVE5",
      discountPercent: 5,
      assetTypes: "forex",
      platforms: "mt5",
      profitSplit: "50-100%",
      maxDrawdown: "6%",
      minFee: 95,
      maxAllocation: "$250K",
      startingPrice: "$95",
      payoutSpeed: "Weekly",
      featured: false,
    },
  ];

  for (const firm of firms) {
    await prisma.propFirm.upsert({
      where: { slug: firm.slug },
      update: firm,
      create: firm,
    });
  }

  const ftmo = await prisma.propFirm.findUnique({ where: { slug: "ftmo" } });
  const demo = await prisma.user.findUnique({ where: { email: "demo@prop.local" } });

  if (ftmo && demo) {
    await prisma.review.upsert({
      where: {
        userId_firmId: { userId: demo.id, firmId: ftmo.id },
      },
      update: {},
      create: {
        rating: 5,
        title: "Solid experience",
        body: "Clear rules, fast support, payouts as promised. Good for disciplined traders.",
        status: "APPROVED",
        userId: demo.id,
        firmId: ftmo.id,
      },
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "best-prop-firms-2026" },
    update: {},
    create: {
      title: "Best Prop Firms in 2026",
      slug: "best-prop-firms-2026",
      excerpt: "A starter guide to comparing prop firms by fees, rules, and payout policies.",
      content:
        "## Overview\n\nChoosing a prop firm depends on your trading style, budget, and risk tolerance.\n\nCompare drawdown rules, profit splits, and evaluation fees before you commit.",
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
