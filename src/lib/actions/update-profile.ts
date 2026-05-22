"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateProfile(name: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not signed in");
  }

  const trimmed = name.trim();
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: trimmed || null },
  });

  revalidatePath("/account");
}
