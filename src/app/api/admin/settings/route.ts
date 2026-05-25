import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminApi } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  statFirmsValue: z.string().min(1).optional(),
  statFirmsLabel: z.string().min(1).optional(),
  statTradersValue: z.string().min(1).optional(),
  statTradersLabel: z.string().min(1).optional(),
  statCouponsValue: z.string().min(1).optional(),
  statCouponsLabel: z.string().min(1).optional(),
  statFreeValue: z.string().min(1).optional(),
  statFreeLabel: z.string().min(1).optional(),
  offersTitle: z.string().min(1).optional(),
  offersSubtitle: z.string().optional().nullable(),
  newsletterTitle: z.string().min(1).optional(),
  newsletterSubtitle: z.string().min(1).optional(),
});

export async function PATCH(request: Request) {
  const forbidden = await assertAdminApi();
  if (forbidden) return forbidden;

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
      ...parsed.data,
      offersSubtitle: parsed.data.offersSubtitle ?? null,
    },
  });

  return NextResponse.json(settings);
}
