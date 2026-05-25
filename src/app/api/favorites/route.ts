import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ firmId: z.string().min(1) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const firm = await prisma.propFirm.findUnique({
    where: { id: parsed.data.firmId, published: true },
  });
  if (!firm) {
    return NextResponse.json({ error: "Firm not found" }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: {
      userId_firmId: { userId: session.user.id, firmId: parsed.data.firmId },
    },
    create: { userId: session.user.id, firmId: parsed.data.firmId },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, firmId: parsed.data.firmId },
  });

  return NextResponse.json({ ok: true });
}
