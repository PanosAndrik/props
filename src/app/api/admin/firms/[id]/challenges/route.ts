import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/api-admin";
import { challengeSchema } from "@/lib/challenge-schema";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const { id: firmId } = await params;
  const firm = await prisma.propFirm.findUnique({ where: { id: firmId } });
  if (!firm) {
    return NextResponse.json({ error: "Firm not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = challengeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const challenge = await prisma.firmChallenge.create({
    data: {
      firmId,
      name: data.name,
      accountSize: data.accountSize || null,
      price: data.price ?? null,
      profitTarget: data.profitTarget || null,
      maxDrawdown: data.maxDrawdown || null,
      profitSplit: data.profitSplit || null,
      published: data.published,
      sortOrder: data.sortOrder,
    },
  });

  return NextResponse.json(challenge);
}
