import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function assertAdminApi() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
