import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChallengeForm } from "@/components/admin/challenge-form";

type Props = { params: Promise<{ id: string }> };

export default async function NewChallengePage({ params }: Props) {
  const { id } = await params;
  const firm = await prisma.propFirm.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!firm) notFound();

  return (
    <>
      <Link
        href={`/admin/firms/${firm.id}/challenges`}
        className="text-sm text-zinc-500 hover:text-zinc-800"
      >
        ← Challenges
      </Link>
      <h2 className="mt-2 text-2xl font-bold text-zinc-900">New challenge — {firm.name}</h2>
      <div className="mt-8">
        <ChallengeForm
          firmId={firm.id}
          backHref={`/admin/firms/${firm.id}/challenges`}
        />
      </div>
    </>
  );
}
