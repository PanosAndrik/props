import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
      description:
        "One of the most popular prop firms. Forex and indices challenges with clear rules.",
      websiteUrl: "https://ftmo.com",
      affiliateUrl: "https://ftmo.com",
      discountCode: "PROP10",
      assetTypes: "forex,indices",
      profitSplit: "80-90%",
      maxDrawdown: "10%",
      minFee: 155,
      featured: true,
    },
    {
      name: "Funding Pips",
      slug: "funding-pips",
      description: "Fast-growing firm with multiple challenge types and competitive pricing.",
      websiteUrl: "https://fundingpips.com",
      discountCode: "FUNDING5",
      assetTypes: "forex,crypto",
      profitSplit: "80-100%",
      maxDrawdown: "8-10%",
      minFee: 59,
      featured: true,
    },
    {
      name: "The5ers",
      slug: "the5ers",
      description: "Established prop firm with bootcamp and high-stakes programs.",
      websiteUrl: "https://the5ers.com",
      assetTypes: "forex",
      profitSplit: "50-100%",
      maxDrawdown: "6%",
      minFee: 95,
      featured: false,
      discountCode: "FIVE5",
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
  console.log("Admin: admin@prop.local / admin123");
  console.log("Demo:  demo@prop.local / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
