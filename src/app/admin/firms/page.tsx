import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminFirmsPage() {
  const firms = await prisma.propFirm.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { reviews: true } } },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Prop firms</h2>
          <p className="mt-1 text-body-sm">Manage firms shown on the public site.</p>
        </div>
        <Link
          href="/admin/firms/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + Add firm
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 table-head">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Coupon</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reviews</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {firms.map((firm) => (
              <tr key={firm.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{firm.name}</p>
                  <p className="text-caption">/firms/{firm.slug}</p>
                </td>
                <td className="px-4 py-3 font-mono text-zinc-600">{firm.rankOrder}</td>
                <td className="px-4 py-3">
                  {firm.discountCode ? (
                    <span className="font-mono text-xs font-semibold text-amber-800">
                      {firm.discountCode}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {firm.published ? (
                      <Badge color="green">Published</Badge>
                    ) : (
                      <Badge color="zinc">Draft</Badge>
                    )}
                    {firm.featured && <Badge color="amber">Featured</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{firm._count.reviews}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/firms/${firm.id}/edit`}
                    className="text-amber-700 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {firms.length === 0 && (
          <p className="px-4 py-8 text-center text-caption">No firms yet.</p>
        )}
      </div>
    </>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "amber" | "zinc";
}) {
  const colors = {
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    zinc: "bg-zinc-100 text-zinc-600",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}
