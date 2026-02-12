import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.adminProduct.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ocean-900">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700">
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400">No products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-ocean-900">Title</th>
                <th className="pb-3 font-medium text-ocean-900">Category</th>
                <th className="pb-3 font-medium text-ocean-900">Price</th>
                <th className="pb-3 font-medium text-ocean-900">Status</th>
                <th className="pb-3 font-medium text-ocean-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-ocean-900">{p.title}</td>
                  <td className="py-3 text-gray-600">{p.category}</td>
                  <td className="py-3 text-gray-600">${p.price.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <Link href={`/admin/products/${p.id}`} className="text-xs font-medium text-aqua-600 hover:text-aqua-700">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
