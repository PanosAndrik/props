"use client";

import { useRef, useState } from "react";

function isUploadedPath(url: string) {
  return url.startsWith("/uploads/");
}

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function CoverImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrlOption, setShowUrlOption] = useState(false);

  const hasUploadedFile = isUploadedPath(value);
  const hasExternalUrl = isExternalUrl(value);
  const hasImage = hasUploadedFile || hasExternalUrl;

  async function handleFile(file: File) {
    setUploadError("");
    setUploading(true);
    setShowUrlOption(false);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error ?? "Upload failed");
      return;
    }

    const data = await res.json();
    onChange(data.url);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700">Cover image</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFileChange}
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 text-center"
      >
        {hasImage ? (
          <div className="space-y-4">
            <div className="mx-auto max-h-56 max-w-md overflow-hidden rounded-lg border border-zinc-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Cover preview"
                className="mx-auto max-h-56 w-full object-contain"
              />
            </div>
            {hasUploadedFile && (
              <p className="text-sm font-medium text-emerald-700">
                ✓ Image ready — click Create post below (no need to type any URL)
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Replace image"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setShowUrlOption(false);
                }}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-600">JPG, PNG, WebP or GIF — max 5 MB</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="mt-4 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <p className="mt-2 text-xs text-zinc-400">or drag and drop here</p>
          </>
        )}
      </div>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      {/* Only show URL option when there is no uploaded file */}
      {!hasUploadedFile && !hasExternalUrl && (
        <div>
          {!showUrlOption ? (
            <button
              type="button"
              onClick={() => setShowUrlOption(true)}
              className="text-sm text-zinc-500 underline hover:text-zinc-800"
            >
              Or use an image from the web (paste https:// URL)
            </button>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <label className="block text-xs font-medium text-zinc-600">
                Image URL (must start with https://)
              </label>
              <input
                type="url"
                value={hasExternalUrl ? value : ""}
                onChange={(e) => onChange(e.target.value.trim())}
                placeholder="https://example.com/image.jpg"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setShowUrlOption(false);
                  onChange("");
                }}
                className="mt-2 text-xs text-zinc-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {hasExternalUrl && !hasUploadedFile && (
        <p className="text-xs text-zinc-500">Using external image URL.</p>
      )}
    </div>
  );
}
