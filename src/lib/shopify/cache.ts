import { unstable_cache } from "next/cache";
import type { ShopifyProduct, StorefrontProductsResponse } from "@/types/shopify";
import { shopifyFetch, hasShopifyCredentials } from "./client";
import { PRODUCTS_QUERY } from "./queries";
import { normalizeProduct } from "./normalize";
import { prisma } from "@/lib/db";

async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  if (!hasShopifyCredentials()) {
    console.log("[Shopify] No credentials found, using seed data");
    const seed = await import("@/data/shopify-seed.json");
    return seed.default as ShopifyProduct[];
  }

  try {
    const products: ShopifyProduct[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const res: StorefrontProductsResponse = await shopifyFetch<StorefrontProductsResponse>(PRODUCTS_QUERY, {
        first: 250,
        after: cursor,
      });

      const edges = res.data.products.edges;
      products.push(...edges.map(normalizeProduct));

      hasNextPage = res.data.products.pageInfo.hasNextPage;
      cursor = res.data.products.pageInfo.endCursor;
    }

    console.log(`[Shopify] Fetched ${products.length} products from Storefront API`);
    return products;
  } catch (error) {
    console.error("[Shopify] API failed, falling back to seed data:", error);
    const seed = await import("@/data/shopify-seed.json");
    return seed.default as ShopifyProduct[];
  }
}

async function applyOverrides(products: ShopifyProduct[]): Promise<ShopifyProduct[]> {
  try {
    const overrides = await prisma.shopifyProductOverride.findMany();
    if (overrides.length === 0) return products;

    const overrideMap = new Map(overrides.map((o) => [o.shopifyProductId, o]));

    return products
      .filter((p) => {
        const override = overrideMap.get(p.id);
        return !override?.isHidden;
      })
      .map((p) => {
        const override = overrideMap.get(p.id);
        if (override?.categoryOverride) {
          return { ...p, category: override.categoryOverride };
        }
        return p;
      })
      .sort((a, b) => {
        const oa = overrideMap.get(a.id)?.sortOrder ?? 0;
        const ob = overrideMap.get(b.id)?.sortOrder ?? 0;
        return oa - ob;
      });
  } catch {
    return products;
  }
}

export const getAllShopifyProducts = unstable_cache(
  async () => {
    const raw = await fetchAllProducts();
    return applyOverrides(raw);
  },
  ["shopify-products"],
  { revalidate: 86400 } // 24 hours
);

export async function getShopifyProductsByCategory(
  category: string
): Promise<ShopifyProduct[]> {
  const all = await getAllShopifyProducts();
  return all.filter((p) => p.category === category);
}

export async function getShopifyCategories(): Promise<
  Array<{ name: string; count: number }>
> {
  const all = await getAllShopifyProducts();
  const counts = new Map<string, number>();

  for (const p of all) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
