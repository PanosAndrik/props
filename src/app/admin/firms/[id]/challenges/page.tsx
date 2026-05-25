import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function FirmChallengesPage({ params }: Props) {
  const { id } = await params;
  const firm = await prisma.propFirm.findUnique({
    where: { id },
    include: {
      challenges: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
    },
  });
  if (!firm) notFound();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={`/admin/firms/${firm.id}/edit`} className="text-sm text-zinc-500 hover:text-zinc-800">
            ← {firm.name}
          </Link>
          <h2 className="mt-2 text-2xl font-bold text-zinc-900">Challenges</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Programs shown on the firm&apos;s Challenges tab.
          </p>
        </div>
        <Link
          href={`/admin/firms/${firm.id}/challenges/new`}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + New challenge
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {firm.challenges.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-zinc-600">{c.accountSize ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {c.price != null ? `$${c.price}` : "—"}
                </td>
                <td className="px-4 py-3">
                  {c.published ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Published
                    </span>
                  ) : (
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/firms/${firm.id}/challenges/${c.id}/edit`}
                    className="text-amber-700 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {firm.challenges.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">No challenges yet.</p>
        )}
      </div>
    </>
  );
}
