import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FirmForm } from "@/components/admin/firm-form";
import { DeleteButton } from "@/components/admin/delete-button";

type Props = { params: Promise<{ id: string }> };

export default async function EditFirmPage({ params }: Props) {
  const { id } = await params;
  const firm = await prisma.propFirm.findUnique({ where: { id } });
  if (!firm) notFound();

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold text-zinc-900">Edit {firm.name}</h2>
        <DeleteButton
          url={`/api/admin/firms/${firm.id}`}
          redirectTo="/admin/firms"
        />
      </div>
      <div className="mt-8">
        <FirmForm
          initial={{
            id: firm.id,
            name: firm.name,
            slug: firm.slug,
            description: firm.description ?? "",
            websiteUrl: firm.websiteUrl ?? "",
            logoUrl: firm.logoUrl ?? "",
            assetTypes: firm.assetTypes,
            profitSplit: firm.profitSplit ?? "",
            maxDrawdown: firm.maxDrawdown ?? "",
            minFee: firm.minFee?.toString() ?? "",
            featured: firm.featured,
            published: firm.published,
          }}
        />
      </div>
    </>
  );
}
