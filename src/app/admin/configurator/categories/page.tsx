import { prisma } from "@/lib/db";
import { getShopifyCategories } from "@/lib/shopify/cache";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function ConfiguratorCategoriesPage() {
  const [shopifyCategories, dbCategories] = await Promise.all([
    getShopifyCategories(),
    prisma.categoryConfig.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  const dbMap = new Map(dbCategories.map((c) => [c.name, c]));

  const merged = shopifyCategories.map((sc) => {
    const db = dbMap.get(sc.name);
    return {
      name: sc.name,
      productCount: sc.count,
      displayOrder: db?.displayOrder ?? 0,
      isActive: db?.isActive ?? true,
      icon: db?.icon ?? "",
      hasConfig: !!db,
    };
  });

  return (
    <div>
      <AdminPageHeader title="Categories" count={merged.length} />
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Category</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Products</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Order</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Active</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Configured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {merged.map((c) => (
              <tr key={c.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ocean-900">{c.icon} {c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.productCount}</td>
                <td className="px-4 py-3 text-gray-600">{c.displayOrder}</td>
                <td className="px-4 py-3">{c.isActive ? <span className="text-green-600">Yes</span> : <span className="text-gray-400">No</span>}</td>
                <td className="px-4 py-3">{c.hasConfig && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Yes</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
