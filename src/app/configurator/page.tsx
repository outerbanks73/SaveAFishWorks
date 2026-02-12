import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getAllShopifyProducts, getShopifyCategories } from "@/lib/shopify/cache";
import { ConfiguratorShell } from "@/components/configurator/ConfiguratorShell";

export const metadata: Metadata = generatePageMetadata({
  title: "Aquascape Configurator",
  description:
    "Build your perfect aquascape. Select a tank size, browse 600+ products across 22 categories, and checkout directly on Aquatic Motiv.",
  path: "/configurator",
});

export default async function ConfiguratorPage() {
  const [products, categories] = await Promise.all([
    getAllShopifyProducts(),
    getShopifyCategories(),
  ]);

  return <ConfiguratorShell products={products} categories={categories} />;
}
