import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";
import { DeleteButton } from "@/components/admin/delete-button";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h2 className="page-title">Edit post</h2>
        <DeleteButton url={`/api/admin/blog/${post.id}`} redirectTo="/admin/blog" />
      </div>
      <div className="mt-8">
        <BlogForm
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            coverImage: post.coverImage ?? "",
            category: post.category ?? "",
            readTimeMinutes: post.readTimeMinutes?.toString() ?? "",
            difficulty: post.difficulty ?? "",
            published: post.published,
          }}
        />
      </div>
    </>
  );
}
