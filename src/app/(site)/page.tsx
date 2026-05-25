import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildFirmWhere, firmIncludeReviews } from "@/lib/firm-query";
import { parseSortKey, sortFirms } from "@/lib/firm-sort";
import { getSiteSettings } from "@/lib/site-settings";
import { HomeHero } from "@/components/home-hero";
import { HomeStatsRow } from "@/components/home-stats-row";
import { ExclusiveOffers } from "@/components/exclusive-offers";
import { HomeRankingsSection } from "@/components/home-rankings-section";
import { FeaturedFirmCards } from "@/components/featured-firm-cards";
import { LatestReviewsSection } from "@/components/latest-reviews-section";
import { HomeBlogGrid } from "@/components/home-blog-grid";
import { NewsletterCta } from "@/components/newsletter-cta";

type Props = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    maxFee?: string;
    instant?: string;
    coupon?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const params = await searchParams;
  const sort = parseSortKey(params.sort);

  const filters = {
    category: params.category,
    maxFee: params.maxFee,
    instant: params.instant,
    coupon: params.coupon,
  };

  const [
    settings,
    totalFirmCount,
    rankedFirmsRaw,
    offerFirms,
    featured,
    latestReviews,
    latestPosts,
  ] = await Promise.all([
    getSiteSettings(),
    prisma.propFirm.count({ where: { published: true } }),
    prisma.propFirm.findMany({
      where: buildFirmWhere(filters),
      include: firmIncludeReviews,
    }),
    prisma.propFirm.findMany({
      where: {
        published: true,
        OR: [{ discountCode: { not: null } }, { discountPercent: { not: null } }],
      },
      include: firmIncludeReviews,
      orderBy: [{ showInOffers: "desc" }, { featured: "desc" }, { rankOrder: "asc" }],
      take: 4,
    }),
    prisma.propFirm.findMany({
      where: { published: true, featured: true },
      take: 3,
      orderBy: { rankOrder: "asc" },
      include: firmIncludeReviews,
    }),
    prisma.review.findMany({
      where: { status: "APPROVED" },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        firm: { select: { name: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      take: 6,
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const rankedFirms = sortFirms(rankedFirmsRaw, sort).slice(0, 10);

  const monthYear = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const offersTitle = `${settings.offersTitle} — ${monthYear}`;

  return (
    <main className="w-full min-w-0">
      <HomeHero
        isAdmin={isAdmin}
        isLoggedIn={!!session}
        userName={session?.user?.name}
      />

      <HomeStatsRow settings={settings} />

      <ExclusiveOffers
        firms={offerFirms}
        title={offersTitle}
        subtitle={
          settings.offersSubtitle ??
          "Copy exclusive discount codes and save at checkout on any prop firm."
        }
      />

      <HomeRankingsSection
        firms={rankedFirms}
        sort={sort}
        totalFirmCount={totalFirmCount}
      />

      <FeaturedFirmCards firms={featured} />
      <LatestReviewsSection reviews={latestReviews} />
      <HomeBlogGrid posts={latestPosts} />

      <NewsletterCta
        title={settings.newsletterTitle}
        subtitle={settings.newsletterSubtitle}
        isLoggedIn={!!session}
      />
    </main>
  );
}
