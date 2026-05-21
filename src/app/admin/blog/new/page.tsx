import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-zinc-900">New blog post</h2>
      <div className="mt-8">
        <BlogForm />
      </div>
    </>
  );
}
