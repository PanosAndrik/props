import Link from "next/link";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <>
      <Link href="/admin/blog" className="text-caption hover:text-zinc-800">
        ← Blog
      </Link>
      <h2 className="mt-2 page-title">New blog post</h2>
      <div className="mt-8">
        <BlogForm />
      </div>
    </>
  );
}
