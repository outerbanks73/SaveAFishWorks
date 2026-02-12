import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/ecommerce/ProductGrid";
import {
  getCategoryBySlug,
  getAllCategories,
  getProductsByCategory,
} from "@/lib/data/products";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  return generatePageMetadata({
    title: `Best ${cat.name} for Aquariums`,
    description: cat.description,
    path: `/products/${category}`,
  });
}

export default async function ProductCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const products = getProductsByCategory(category);
  const breadcrumbs = buildBreadcrumbs([
    { label: "Products", href: "/products" },
    { label: cat.name, href: `/products/${category}` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">{cat.name}</h1>
      <p className="mb-8 text-gray-600">{cat.description}</p>
      <ProductGrid products={products} />
    </div>
  );
}
