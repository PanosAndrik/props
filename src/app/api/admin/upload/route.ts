import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { assertAdminApi } from "@/lib/api-admin";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const ALLOWED_FOLDERS = new Set(["blog", "firms"]);

export async function POST(request: Request) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP or GIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller" },
        { status: 400 }
      );
    }

    const folderRaw = formData.get("folder");
    const folder =
      typeof folderRaw === "string" && ALLOWED_FOLDERS.has(folderRaw)
        ? folderRaw
        : "blog";

    const ext = EXT_BY_TYPE[file.type] ?? "jpg";
    const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${folder}/${filename}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
