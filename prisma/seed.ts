import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const prosFtmo = JSON.stringify([
  "Up to 90% profit split — industry leading",
  "On-demand payouts — no waiting for scheduled dates",
  "No time limit — trade at your own pace",
  "Max $400K allocation — scale up to $2M",
  "Multiple platforms: MT4, MT5, cTrader, DXTrade",
  "Weekend and overnight holding allowed",
]);
const consFtmo = JSON.stringify([
  "Higher fees vs newer firms — use PROP10 for 10% off",
  "News trading restricted in funded accounts",
  "No instant funding — must pass evaluation",
  "Expert Advisors not allowed in funded accounts",
  "HFT and arbitrage strictly prohibited",
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
      showInOffers: true,
      brandColor: "blue",
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
      showInOffers: true,
      brandColor: "orange",
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
      showInOffers: true,
      brandColor: "green",
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

  if (ftmo) {
    await prisma.propFirm.update({
      where: { id: ftmo.id },
      data: {
        legalName: "FTMO s.r.o.",
        headquarters: "Prague, Czech Republic",
        trustScore: 92,
        verified: true,
        referralStats: "Thousands of traders chose FTMO via PropCompare",
        incentiveText:
          "This could be your turning point. Compare rules, use your coupon at checkout, and start your evaluation when you are ready.",
        challengeTypes: "1-Step, 2-Step",
        maxChallengeFee: 1080,
        profitTargetP1: "10%",
        profitTargetP2: "5%",
        payoutFrequency: "On demand / Bi-weekly",
        brokerName: "FTMO",
        dailyDrawdown: "5%",
        minTradingDays: "None",
        maxTradingDays: "Unlimited",
        scalingPlan: "Up to $2,000,000",
        swapFree: "Available on request",
        drawdownExplained:
          "FTMO uses balance-based drawdown on most programs. Daily drawdown is typically 5% with max overall drawdown of 10%. Check your specific challenge type for exact rules.",
        rulesDetail:
          "Standard FTMO rules apply: no martingale abuse, no tick scalping or HFT on funded accounts. Weekend holding is allowed on swing programs.",
        profileUpdatedAt: new Date(),
      },
    });

    const ftmoChallenges = [
      {
        name: "2-Step Challenge $10K",
        accountSize: "$10K",
        price: 155,
        profitTarget: "10% / 5%",
        maxDrawdown: "10%",
        profitSplit: "80/20",
        sortOrder: 1,
      },
      {
        name: "2-Step Challenge $100K",
        accountSize: "$100K",
        price: 1080,
        profitTarget: "10% / 5%",
        maxDrawdown: "10%",
        profitSplit: "80/20",
        sortOrder: 2,
      },
      {
        name: "Swing Challenge $50K",
        accountSize: "$50K",
        price: 495,
        profitTarget: "10%",
        maxDrawdown: "10%",
        profitSplit: "80/20",
        sortOrder: 3,
      },
    ];

    for (const ch of ftmoChallenges) {
      const existing = await prisma.firmChallenge.findFirst({
        where: { firmId: ftmo.id, name: ch.name },
      });
      if (existing) {
        await prisma.firmChallenge.update({ where: { id: existing.id }, data: ch });
      } else {
        await prisma.firmChallenge.create({ data: { firmId: ftmo.id, ...ch } });
      }
    }
  }

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

  const blogPosts = [
    {
      title: "Best Prop Firms in 2026",
      slug: "best-prop-firms-2026",
      excerpt: "A starter guide to comparing prop firms by fees, rules, and payout policies.",
      content:
        "## Overview\n\nChoosing a prop firm depends on your trading style, budget, and risk tolerance.\n\nCompare drawdown rules, profit splits, and evaluation fees before you commit.",
      category: "Rankings",
      difficulty: "Beginner",
      readTimeMinutes: 6,
    },
    {
      title: "FTMO vs Funding Pips: Full Comparison",
      slug: "ftmo-vs-funding-pips",
      excerpt: "Side-by-side look at two of the most popular prop firms for forex traders.",
      content:
        "## FTMO\n\nEstablished brand with clear rules.\n\n## Funding Pips\n\nCompetitive pricing and frequent promos.",
      category: "Comparison",
      difficulty: "Intermediate",
      readTimeMinutes: 8,
    },
    {
      title: "How to Pass a Prop Firm Challenge",
      slug: "how-to-pass-prop-challenge",
      excerpt: "Practical tips on risk, consistency, and avoiding rule violations.",
      content:
        "## Risk first\n\nNever risk more than you can afford to lose on evaluation fees.\n\n## Consistency\n\nAvoid lottery trades before payout.",
      category: "Guide",
      difficulty: "Beginner",
      readTimeMinutes: 5,
    },
    {
      title: "May 2026 Coupon Codes Roundup",
      slug: "coupon-codes-may-2026",
      excerpt: "Latest discount codes for top prop firms this month.",
      content:
        "## Active deals\n\nCheck each firm page for verified coupon codes updated by our team.",
      category: "Deals",
      difficulty: "Beginner",
      readTimeMinutes: 4,
    },
    {
      title: "Instant Funding vs Evaluation Programs",
      slug: "instant-funding-vs-evaluation",
      excerpt: "Which program type fits your trading style and budget?",
      content:
        "## Instant funding\n\nFaster start, often stricter rules.\n\n## Evaluation\n\nLower entry cost, two-step path to funded account.",
      category: "Tutorial",
      difficulty: "Intermediate",
      readTimeMinutes: 7,
    },
    {
      title: "Top 5 Prop Firms for Beginners",
      slug: "top-prop-firms-beginners",
      excerpt: "Firms with simpler rules and supportive communities for new traders.",
      content:
        "## What beginners need\n\nClear rules, reasonable fees, and good education resources.",
      category: "Guide",
      difficulty: "Beginner",
      readTimeMinutes: 6,
    },
  ];

  await prisma.blogPost.updateMany({
    where: { category: "Beginner" },
    data: { category: "Guide" },
  });

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        category: post.category,
        difficulty: post.difficulty,
        readTimeMinutes: post.readTimeMinutes,
      },
      create: {
        ...post,
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
