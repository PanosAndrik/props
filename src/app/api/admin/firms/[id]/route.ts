import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminApi } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const firmSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  affiliateUrl: z.string().optional().nullable(),
  discountCode: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  assetTypes: z.string().optional(),
  profitSplit: z.string().optional().nullable(),
  maxDrawdown: z.string().optional().nullable(),
  minFee: z.coerce.number().optional().nullable(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

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
  if (data.slug) {
    const conflict = await prisma.propFirm.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const firm = await prisma.propFirm.update({
    where: { id },
    data: {
      ...data,
      slug: data.slug ?? undefined,
      name: data.name ?? undefined,
    },
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
