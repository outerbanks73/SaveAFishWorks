const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "";
const token = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";

const endpoint = `https://${domain}/api/2026-01/graphql.json`;

export function hasShopifyCredentials(): boolean {
  return domain.length > 0 && token.length > 0;
}

export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
