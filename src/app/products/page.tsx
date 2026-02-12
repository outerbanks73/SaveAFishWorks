import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllCategories } from "@/lib/data/products";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Aquarium Products & Equipment",
  description:
    "Browse our curated selection of aquarium products including filters, heaters, lighting, substrate, and more. Expert reviews and recommendations.",
  path: "/products",
});

export default function ProductsHubPage() {
  const categories = getAllCategories();
  const breadcrumbs = buildBreadcrumbs([
    { label: "Products", href: "/products" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        Aquarium Products
      </h1>
      <p className="mb-8 text-gray-600">
        Expert-reviewed aquarium equipment and supplies. Find the right gear for
        your tank.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className="group rounded-lg border border-gray-200 p-5 transition hover:border-aqua-300 hover:shadow-md"
          >
            <h2 className="font-semibold text-ocean-900 group-hover:text-aqua-700">
              {cat.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
