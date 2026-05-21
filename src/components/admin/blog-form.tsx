"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type BlogFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
};

const empty: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  published: false,
};

export function BlogForm({ initial }: { initial?: Partial<BlogFormData> }) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>({ ...empty, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!initial?.id;

  function set<K extends keyof BlogFormData>(key: K, value: BlogFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      slug: form.slug || undefined,
    };

    const url = isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error?.toString?.() ?? data.error ?? "Save failed");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700">Title *</label>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Slug</label>
        <p className="text-xs text-zinc-500">Leave empty to auto-generate</p>
        <input
          className={`${inputClass} mt-1`}
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Excerpt</label>
        <textarea
          className={`${inputClass} mt-1`}
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Cover image URL</label>
        <input
          className={`${inputClass} mt-1`}
          value={form.coverImage}
          onChange={(e) => set("coverImage", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Content *</label>
        <textarea
          className={`${inputClass} mt-1 font-mono text-xs`}
          rows={16}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          required
        />
        <p className="mt-1 text-xs text-zinc-500">Markdown-style plain text for now.</p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        Published
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : isEdit ? "Save post" : "Create post"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
