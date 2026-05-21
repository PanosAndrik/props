import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminApi } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const { id } = await params;
  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  if (data.slug) {
    const conflict = await prisma.blogPost.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const current = await prisma.blogPost.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const publishing = data.published === true && !current.published;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt: publishing
        ? new Date()
        : data.published === false
          ? null
          : undefined,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(_request: Request, { params }: Props) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
