import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminApi } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const firmSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  assetTypes: z.string().default("forex,crypto"),
  profitSplit: z.string().optional().nullable(),
  maxDrawdown: z.string().optional().nullable(),
  minFee: z.coerce.number().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

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
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      websiteUrl: data.websiteUrl || null,
      logoUrl: data.logoUrl || null,
      assetTypes: data.assetTypes,
      profitSplit: data.profitSplit || null,
      maxDrawdown: data.maxDrawdown || null,
      minFee: data.minFee ?? null,
      featured: data.featured,
      published: data.published,
    },
  });

  return NextResponse.json(firm);
}
