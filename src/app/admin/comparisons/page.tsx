import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminComparisonsPage() {
  const comparisons = await prisma.comparison.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, status: true, updatedAt: true },
  });

  return (
    <div>
      <AdminPageHeader title="Comparisons" count={comparisons.length} addHref="/admin/comparisons/new" addLabel="New Comparison" />
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Title</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Status</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Updated</th>
              <th className="px-4 py-3 text-right font-medium text-ocean-900/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comparisons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ocean-900">{c.title}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-gray-500">{c.updatedAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/comparisons/${c.id}`} className="text-aqua-600 hover:text-aqua-700">Edit</Link>
                </td>
              </tr>
            ))}
            {comparisons.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No comparisons yet. Seed the database or create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
