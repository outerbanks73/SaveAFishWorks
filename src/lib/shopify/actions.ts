"use server";

import type { ShopifyCartLine, StorefrontCartCreateResponse } from "@/types/shopify";
import { shopifyFetch, hasShopifyCredentials } from "./client";
import { CART_CREATE_MUTATION } from "./mutations";

export async function createShopifyCart(
  lines: ShopifyCartLine[]
): Promise<{ checkoutUrl: string } | { error: string }> {
  if (!hasShopifyCredentials()) {
    return { error: "Shopify Storefront API is not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN to your environment." };
  }

  if (lines.length === 0) {
    return { error: "Cart is empty." };
  }

  try {
    const res = await shopifyFetch<StorefrontCartCreateResponse>(CART_CREATE_MUTATION, {
      lines: lines.map((line) => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      })),
    });

    const userErrors = res.data.cartCreate.userErrors;
    if (userErrors.length > 0) {
      return { error: userErrors.map((e) => e.message).join(", ") };
    }

    const cart = res.data.cartCreate.cart;
    if (!cart) {
      return { error: "Failed to create cart." };
    }

    return { checkoutUrl: cart.checkoutUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create cart." };
  }
}
