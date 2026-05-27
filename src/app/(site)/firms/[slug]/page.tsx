import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FirmProfileView } from "@/components/firm-profile/firm-profile-view";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const firm = await prisma.propFirm.findUnique({
    where: { slug, published: true },
    select: { name: true, description: true },
  });
  if (!firm) return { title: "Firm not found" };
  return {
    title: `${firm.name} — Reviews & Coupon | PropCompare`,
    description: firm.description ?? `Compare ${firm.name} rules, fees, and trader reviews.`,
  };
}

export default async function FirmDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const firm = await prisma.propFirm.findUnique({
    where: { slug, published: true },
    include: {
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
      challenges: {
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
  });

  if (!firm) notFound();

  const [favorite, userReview] = await Promise.all([
    session?.user?.id
      ? prisma.favorite.findUnique({
          where: { userId_firmId: { userId: session.user.id, firmId: firm.id } },
        })
      : null,
    session?.user?.id
      ? prisma.review.findFirst({
          where: { firmId: firm.id, userId: session.user.id },
        })
      : null,
  ]);

  return (
    <FirmProfileView
      firm={firm}
      isLoggedIn={!!session}
      isFavorited={!!favorite}
      hasUserReview={!!userReview}
    />
  );
}
