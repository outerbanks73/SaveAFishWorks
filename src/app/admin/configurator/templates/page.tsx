import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function ConfiguratorTemplatesPage() {
  const templates = await prisma.configuratorTemplate.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="Templates" count={templates.length} addHref="/admin/configurator/templates/new" addLabel="New Template" />
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Name</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Style</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Tank</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Difficulty</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Products</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Active</th>
              <th className="px-4 py-3 text-right font-medium text-ocean-900/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ocean-900">{t.name}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{t.style}</td>
                <td className="px-4 py-3 text-gray-600">{t.tankId}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{t.difficulty}</td>
                <td className="px-4 py-3 text-gray-600">{t.shopifyProductIds.length}</td>
                <td className="px-4 py-3">{t.isActive ? <span className="text-green-600">Yes</span> : <span className="text-gray-400">No</span>}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/configurator/templates/${t.id}`} className="text-aqua-600 hover:text-aqua-700">Edit</Link>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No templates yet. Seed or create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
