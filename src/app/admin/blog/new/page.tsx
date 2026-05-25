import Link from "next/link";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <>
      <Link href="/admin/blog" className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Blog
      </Link>
      <h2 className="mt-2 text-2xl font-bold text-zinc-900">New blog post</h2>
      <div className="mt-8">
        <BlogForm />
      </div>
    </>
  );
}
