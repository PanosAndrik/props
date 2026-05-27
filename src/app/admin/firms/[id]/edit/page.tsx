import Link from "next/link";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { firmToForm } from "@/lib/firm-form-mapper";

import { FirmForm } from "@/components/admin/firm-form";

import { DeleteButton } from "@/components/admin/delete-button";



type Props = { params: Promise<{ id: string }> };



export default async function EditFirmPage({ params }: Props) {

  const { id } = await params;

  const firm = await prisma.propFirm.findUnique({

    where: { id },

    include: { _count: { select: { challenges: true } } },

  });

  if (!firm) notFound();



  return (

    <>

      <div className="flex items-start justify-between gap-4">

        <div>

          <h2 className="page-title">Edit {firm.name}</h2>

          <Link

            href={`/admin/firms/${firm.id}/challenges`}

            className="mt-2 inline-block text-sm font-medium text-amber-700 hover:underline"

          >

            Manage challenges ({firm._count.challenges}) →

          </Link>

        </div>

        <DeleteButton url={`/api/admin/firms/${firm.id}`} redirectTo="/admin/firms" />

      </div>

      <div className="mt-8">

        <FirmForm initial={firmToForm(firm)} />

      </div>

    </>

  );

}

