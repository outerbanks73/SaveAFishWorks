import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminGuidesPage() {
  const guides = await prisma.guide.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, category: true, status: true, author: true, updatedAt: true },
  });

  return (
    <div>
      <AdminPageHeader title="Guides" count={guides.length} addHref="/admin/guides/new" addLabel="New Guide" />
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Title</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Category</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Status</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Author</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Updated</th>
              <th className="px-4 py-3 text-right font-medium text-ocean-900/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guides.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ocean-900">{g.title}</td>
                <td className="px-4 py-3 text-gray-600">{g.category}</td>
                <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                <td className="px-4 py-3 text-gray-600">{g.author}</td>
                <td className="px-4 py-3 text-gray-500">{g.updatedAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/guides/${g.id}`} className="text-aqua-600 hover:text-aqua-700">Edit</Link>
                </td>
              </tr>
            ))}
            {guides.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No guides yet. Seed the database or create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
