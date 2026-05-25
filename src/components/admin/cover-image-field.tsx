"use client";

import { ImageUploadField } from "./image-upload-field";

export function CoverImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  return (
    <ImageUploadField
      label="Cover image"
      value={value}
      onChange={onChange}
      uploadFolder="blog"
    />
  );
}
