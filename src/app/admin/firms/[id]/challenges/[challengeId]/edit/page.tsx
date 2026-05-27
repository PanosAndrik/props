import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChallengeForm } from "@/components/admin/challenge-form";
import { challengeToForm } from "@/lib/challenge-form-mapper";
import { DeleteButton } from "@/components/admin/delete-button";

type Props = { params: Promise<{ id: string; challengeId: string }> };

export default async function EditChallengePage({ params }: Props) {
  const { id, challengeId } = await params;
  const challenge = await prisma.firmChallenge.findFirst({
    where: { id: challengeId, firmId: id },
    include: { firm: { select: { name: true } } },
  });
  if (!challenge) notFound();

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/admin/firms/${id}/challenges`}
            className="text-caption hover:text-zinc-800"
          >
            ← Challenges
          </Link>
          <h2 className="mt-2 page-title">
            Edit — {challenge.firm.name}
          </h2>
        </div>
        <DeleteButton
          url={`/api/admin/challenges/${challenge.id}`}
          redirectTo={`/admin/firms/${id}/challenges`}
        />
      </div>
      <div className="mt-8">
        <ChallengeForm
          firmId={id}
          initial={challengeToForm(challenge)}
          backHref={`/admin/firms/${id}/challenges`}
        />
      </div>
    </>
  );
}
