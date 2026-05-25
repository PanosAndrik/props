"use client";



import { useRouter } from "next/navigation";

import { useState } from "react";

import { CoverImageField } from "./cover-image-field";

import { BLOG_CATEGORIES, BLOG_DIFFICULTIES, estimateReadTime } from "@/lib/blog-meta";



export type BlogFormData = {

  id?: string;

  title: string;

  slug: string;

  excerpt: string;

  content: string;

  coverImage: string;

  category: string;

  readTimeMinutes: string;

  difficulty: string;

  published: boolean;

};



const empty: BlogFormData = {

  title: "",

  slug: "",

  excerpt: "",

  content: "",

  coverImage: "",

  category: "",

  readTimeMinutes: "",

  difficulty: "",

  published: false,

};

function normalizeCategory(value?: string) {
  if (!value) return "";
  return (BLOG_CATEGORIES as readonly string[]).includes(value) ? value : "";
}

export function BlogForm({ initial }: { initial?: Partial<BlogFormData> }) {

  const router = useRouter();

  const [form, setForm] = useState<BlogFormData>({
    ...empty,
    ...initial,
    category: normalizeCategory(initial?.category),
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const isEdit = !!initial?.id;



  function set<K extends keyof BlogFormData>(key: K, value: BlogFormData[K]) {

    setForm((f) => ({ ...f, [key]: value }));

  }



  function onContentChange(content: string) {

    setForm((f) => ({

      ...f,

      content,

      readTimeMinutes:

        f.readTimeMinutes || String(estimateReadTime(content)),

    }));

  }



  async function onSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    setError("");



    const readMins = form.readTimeMinutes

      ? parseInt(form.readTimeMinutes, 10)

      : estimateReadTime(form.content);



    const payload = {

      ...form,

      excerpt: form.excerpt || null,

      coverImage: form.coverImage || null,

      category: form.category || null,

      difficulty: form.difficulty || null,

      readTimeMinutes: readMins,

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

    <form onSubmit={onSubmit} noValidate className="max-w-3xl space-y-5">

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



      <div className="grid gap-4 sm:grid-cols-3">

        <div>

          <label className="block text-sm font-medium text-zinc-700">Category</label>

          <select

            className={`${inputClass} mt-1`}

            value={form.category}

            onChange={(e) => set("category", e.target.value)}

          >

            <option value="">—</option>

            {BLOG_CATEGORIES.map((c) => (

              <option key={c} value={c}>

                {c}

              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="block text-sm font-medium text-zinc-700">Difficulty</label>

          <select

            className={`${inputClass} mt-1`}

            value={form.difficulty}

            onChange={(e) => set("difficulty", e.target.value)}

          >

            <option value="">—</option>

            {BLOG_DIFFICULTIES.map((d) => (

              <option key={d} value={d}>

                {d}

              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="block text-sm font-medium text-zinc-700">Read time (min)</label>

          <input

            className={`${inputClass} mt-1`}

            type="number"

            min={1}

            value={form.readTimeMinutes}

            onChange={(e) => set("readTimeMinutes", e.target.value)}

          />

          <p className="mt-1 text-xs text-zinc-500">Auto-filled from content if empty</p>

        </div>

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



      <CoverImageField

        value={form.coverImage}

        onChange={(url) => set("coverImage", url)}

      />



      <div>

        <label className="block text-sm font-medium text-zinc-700">Content *</label>

        <textarea

          className={`${inputClass} mt-1 font-mono text-xs`}

          rows={16}

          value={form.content}

          onChange={(e) => onContentChange(e.target.value)}

          required

        />

        <p className="mt-1 text-xs text-zinc-500">Markdown-style plain text for now.</p>

      </div>



      <label className="flex items-center gap-2 text-sm font-medium text-zinc-800">

        <input

          type="checkbox"

          checked={form.published}

          onChange={(e) => set("published", e.target.checked)}

        />

        Published (visible on /blog for all visitors)

      </label>

      {!form.published && (

        <p className="text-xs text-amber-800">

          Unchecked = draft. You can preview at /blog/your-slug while logged in as admin.

        </p>

      )}



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


