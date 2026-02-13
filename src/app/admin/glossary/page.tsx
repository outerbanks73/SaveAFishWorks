import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminGlossaryPage() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, term: true, category: true, status: true, updatedAt: true },
  });

  return (
    <div>
      <AdminPageHeader title="Glossary" count={terms.length} addHref="/admin/glossary/new" addLabel="New Term" />
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Term</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Category</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Status</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Updated</th>
              <th className="px-4 py-3 text-right font-medium text-ocean-900/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {terms.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ocean-900">{t.term}</td>
                <td className="px-4 py-3 text-gray-600">{t.category}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-gray-500">{t.updatedAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/glossary/${t.id}`} className="text-aqua-600 hover:text-aqua-700">Edit</Link>
                </td>
              </tr>
            ))}
            {terms.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No glossary terms yet. Seed the database or create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
