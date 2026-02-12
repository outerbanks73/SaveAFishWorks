import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDirectoryPage } from "@/components/templates/ProductDirectoryPage";
import {
  getProductBySlug,
  getProductSlugs,
  getCategoryBySlug,
} from "@/lib/data/products";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return getProductSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return generatePageMetadata({
    title: `${product.name} Review`,
    description: product.description,
    path: `/products/${product.category}/${slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== category) notFound();

  const cat = getCategoryBySlug(category);
  const categoryName = cat?.name ?? category;

  return (
    <ProductDirectoryPage product={product} categoryName={categoryName} />
  );
}
