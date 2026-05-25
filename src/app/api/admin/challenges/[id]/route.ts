import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/api-admin";
import { challengeSchema } from "@/lib/challenge-schema";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const { id } = await params;
  const existing = await prisma.firmChallenge.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = challengeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const challenge = await prisma.firmChallenge.update({
    where: { id },
    data: {
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

export async function DELETE(_request: Request, { params }: Params) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const { id } = await params;
  await prisma.firmChallenge.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
