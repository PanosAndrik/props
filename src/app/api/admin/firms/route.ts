import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/api-admin";
import { firmSchema, firmInputToDb } from "@/lib/firm-schema";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function POST(request: Request) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const body = await request.json();
  const parsed = firmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.name);

  const existing = await prisma.propFirm.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const firm = await prisma.propFirm.create({
    data: firmInputToDb(data, slug),
  });

  return NextResponse.json(firm);
}
