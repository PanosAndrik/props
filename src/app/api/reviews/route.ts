import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  firmId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const firm = await prisma.propFirm.findUnique({
      where: { id: parsed.data.firmId },
    });
    if (!firm) {
      return NextResponse.json({ error: "Firm not found" }, { status: 404 });
    }

    const existing = await prisma.review.findUnique({
      where: {
        userId_firmId: {
          userId: session.user.id,
          firmId: parsed.data.firmId,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You already submitted a review for this firm." },
        { status: 409 }
      );
    }

    await prisma.review.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
