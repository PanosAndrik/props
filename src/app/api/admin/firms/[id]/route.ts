import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/api-admin";
import { firmSchema, firmInputToDb } from "@/lib/firm-schema";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const { id } = await params;
  const body = await request.json();
  const parsed = firmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const current = await prisma.propFirm.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = data.slug?.trim() || current.slug;
  if (data.slug) {
    const conflict = await prisma.propFirm.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const firm = await prisma.propFirm.update({
    where: { id },
    data: firmInputToDb(data, slug),
  });

  return NextResponse.json(firm);
}

export async function DELETE(_request: Request, { params }: Props) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const { id } = await params;
  await prisma.propFirm.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
