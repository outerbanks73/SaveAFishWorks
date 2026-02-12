import type { Product } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedContent } from "@/components/content/RelatedContent";
import { PriceDisplay } from "@/components/ecommerce/PriceDisplay";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";
import { productSchema } from "@/lib/seo/schema";

interface ProductDirectoryPageProps {
  product: Product;
  categoryName: string;
}

export function ProductDirectoryPage({
  product,
  categoryName,
}: ProductDirectoryPageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "Products", href: "/products" },
    { label: categoryName, href: `/products/${product.category}` },
    { label: product.name, href: `/products/${product.category}/${product.slug}` },
  ]);

  const relatedItems = [
    ...product.relatedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
    ...product.relatedFish.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/fish/${slug}`,
      type: "Fish",
    })),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={productSchema({
          name: product.name,
          description: product.description,
          url: `https://learn.aquaticmotiv.com/products/${product.category}/${product.slug}`,
          image: product.image,
          price: product.price,
          rating: product.rating,
          reviewCount: product.reviewCount,
          inStock: product.inStock,
          brand: product.brand,
        })}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <span className="text-sm font-medium text-gray-500 uppercase">
            {product.brand}
          </span>
          <h1 className="mb-2 text-3xl font-bold text-ocean-900">
            {product.name}
          </h1>
          <Rating value={product.rating} count={product.reviewCount} />
          <div className="mt-3">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
            />
          </div>
          <p className="mt-4 text-gray-600">{product.description}</p>

          {product.inStock ? (
            <Badge variant="success">In Stock</Badge>
          ) : (
            <Badge variant="danger">Out of Stock</Badge>
          )}
        </div>

        <div>
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-ocean-900">
              Key Features
            </h2>
            <ul className="space-y-1">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-aqua-500">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-ocean-900">
              Specifications
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="py-1.5 pr-3 font-medium text-gray-600">
                      {key}
                    </td>
                    <td className="py-1.5 text-ocean-900">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-green-800">Pros</h3>
          <ul className="space-y-1">
            {product.pros.map((p) => (
              <li key={p} className="text-sm text-green-700">+ {p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-red-800">Cons</h3>
          <ul className="space-y-1">
            {product.cons.map((c) => (
              <li key={c} className="text-sm text-red-700">- {c}</li>
            ))}
          </ul>
        </div>
      </div>

      <RelatedContent items={relatedItems} />
    </div>
  );
}
