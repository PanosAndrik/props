"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function approveReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { status: "APPROVED" },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
  revalidatePath("/firms", "layout");
}

export async function rejectReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
}
