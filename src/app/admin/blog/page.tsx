import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { AdminBlogFilters } from "@/components/admin/admin-blog-filters";
import { buildAdminBlogOrderBy, buildAdminBlogWhere } from "@/lib/admin-blog-query";
import { categoryStyle } from "@/lib/blog-meta";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    difficulty?: string;
    status?: string;
    sort?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function AdminBlogPage({ searchParams }: Props) {
  const filters = await searchParams;

  const where = buildAdminBlogWhere(filters);
  const orderBy = buildAdminBlogOrderBy(filters.sort);

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy,
  });

  const total = await prisma.blogPost.count();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="page-title">Blog</h2>
          <p className="mt-1 text-body-sm">Create and publish articles.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + New post
        </Link>
      </div>

      <Suspense fallback={<div className="mt-6 h-40 rounded-xl border border-zinc-200 bg-zinc-50" />}>
        <AdminBlogFilters />
      </Suspense>

      <p className="mt-4 text-caption">
        Showing {posts.length} of {total} post{total !== 1 ? "s" : ""}
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 table-head">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-zinc-50/50">
                <td className="px-4 py-3">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-caption">/blog/{post.slug}</p>
                  {post.readTimeMinutes != null && (
                    <p className="text-xs text-zinc-400">{post.readTimeMinutes} min read</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {post.category ? (
                    <span
                      className={`rounded border px-1.5 py-0.5 text-xs font-medium ${categoryStyle(post.category)}`}
                    >
                      {post.category}
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">{post.difficulty ?? "—"}</td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Published
                    </span>
                  ) : (
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                  {post.updatedAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                  {post.publishedAt
                    ? post.publishedAt.toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-zinc-600 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-amber-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="px-4 py-8 text-center text-caption">
            No posts match your filters.{" "}
            <Link href="/admin/blog" className="text-amber-700 underline">
              Clear filters
            </Link>
          </p>
        )}
      </div>
    </>
  );
}
