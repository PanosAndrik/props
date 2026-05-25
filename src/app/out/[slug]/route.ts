import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAffiliateSource } from "@/lib/affiliate-out";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function GET(req: Request, { params }: Props) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const rawSource = searchParams.get("src") ?? "unknown";
  const source = isAffiliateSource(rawSource) ? rawSource : "unknown";

  const firm = await prisma.propFirm.findUnique({
    where: { slug, published: true },
    select: { id: true, affiliateUrl: true, websiteUrl: true },
  });

  if (!firm) {
    return NextResponse.redirect(new URL("/firms", req.url), 302);
  }

  const destination = (firm.affiliateUrl?.trim() || firm.websiteUrl?.trim()) ?? null;

  if (!destination) {
    return NextResponse.redirect(new URL(`/firms/${slug}`, req.url), 302);
  }

  const session = await auth();

  await prisma.affiliateClick.create({
    data: {
      firmId: firm.id,
      userId: session?.user?.id ?? null,
      source,
      destinationUrl: destination,
    },
  });

  return NextResponse.redirect(destination, 302);
}
