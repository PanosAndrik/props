import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminApi } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

export async function POST(request: Request) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
    },
  });

  return NextResponse.json(post);
}
