import { prisma } from "@/lib/prisma";

export type AffiliateAnalyticsSummary = {
  total: number;
  last7: number;
  last30: number;
  clicksByFirm: { firm: { id: string; name: string; slug: string }; count: number }[];
  clicksBySource: { source: string; count: number }[];
  recent: {
    id: string;
    source: string;
    createdAt: Date;
    firm: { name: string; slug: string };
    user: { email: string } | null;
  }[];
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getAffiliateAnalyticsSummary(): Promise<AffiliateAnalyticsSummary> {
  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [total, last7, last30, byFirm, bySource, recent] = await Promise.all([
    prisma.affiliateClick.count(),
    prisma.affiliateClick.count({ where: { createdAt: { gte: since7 } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: since30 } } }),
    prisma.affiliateClick.groupBy({
      by: ["firmId"],
      _count: { id: true },
      where: { createdAt: { gte: since30 } },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    }),
    prisma.affiliateClick.groupBy({
      by: ["source"],
      _count: { id: true },
      where: { createdAt: { gte: since30 } },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.affiliateClick.findMany({
      take: 25,
      orderBy: { createdAt: "desc" },
      include: {
        firm: { select: { name: true, slug: true } },
        user: { select: { email: true } },
      },
    }),
  ]);

  const firmIds = byFirm.map((r) => r.firmId);
  const firms =
    firmIds.length > 0
      ? await prisma.propFirm.findMany({
          where: { id: { in: firmIds } },
          select: { id: true, name: true, slug: true },
        })
      : [];
  const firmMap = new Map(firms.map((f) => [f.id, f]));

  const clicksByFirm = byFirm
    .map((row) => {
      const firm = firmMap.get(row.firmId);
      if (!firm) return null;
      return { firm, count: row._count.id };
    })
    .filter((r): r is { firm: { id: string; name: string; slug: string }; count: number } =>
      r !== null
    );

  return {
    total,
    last7,
    last30,
    clicksByFirm,
    clicksBySource: bySource.map((r) => ({
      source: r.source,
      count: r._count.id,
    })),
    recent,
  };
}
