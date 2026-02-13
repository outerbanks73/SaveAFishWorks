import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAllShopifyProducts } from "@/lib/shopify/cache";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function ConfiguratorProductsPage() {
  const [shopifyProducts, overrides] = await Promise.all([
    getAllShopifyProducts(),
    prisma.shopifyProductOverride.findMany(),
  ]);

  const overrideMap = new Map(overrides.map((o) => [o.shopifyProductId, o]));

  const merged = shopifyProducts.map((p) => {
    const override = overrideMap.get(p.id);
    return {
      id: p.id,
      title: p.title,
      category: override?.categoryOverride ?? p.category,
      price: p.price,
      isHidden: override?.isHidden ?? false,
      hasOverride: !!override,
    };
  });

  const hiddenCount = merged.filter((p) => p.isHidden).length;

  return (
    <div>
      <AdminPageHeader title="Shopify Products" count={merged.length} />
      <p className="mb-4 text-sm text-gray-500">{hiddenCount} hidden, {overrides.length} with overrides</p>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Title</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Category</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Price</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Override</th>
              <th className="px-4 py-3 text-left font-medium text-ocean-900/60">Hidden</th>
              <th className="px-4 py-3 text-right font-medium text-ocean-900/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {merged.slice(0, 100).map((p) => (
              <tr key={p.id} className={`hover:bg-gray-50 ${p.isHidden ? "opacity-50" : ""}`}>
                <td className="px-4 py-3 font-medium text-ocean-900">{p.title}</td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 text-gray-600">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {p.hasOverride && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Override</span>}
                </td>
                <td className="px-4 py-3">{p.isHidden && <span className="text-red-500">Hidden</span>}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/configurator/products/${encodeURIComponent(p.id)}`} className="text-aqua-600 hover:text-aqua-700">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {merged.length > 100 && <p className="mt-2 text-sm text-gray-400">Showing first 100 of {merged.length} products</p>}
    </div>
  );
}
