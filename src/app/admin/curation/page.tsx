import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminCurationPage() {
  const lists = await prisma.curationList.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, status: true, updatedAt: true },
  });

  return (
    <div>
      <AdminPageHeader title="Curation Lists" count={lists.length} addHref="/admin/curation/new" addLabel="New List" />
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
            {lists.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ocean-900">{l.title}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 text-gray-500">{l.updatedAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/curation/${l.id}`} className="text-aqua-600 hover:text-aqua-700">Edit</Link>
                </td>
              </tr>
            ))}
            {lists.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No curation lists yet. Seed the database or create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
