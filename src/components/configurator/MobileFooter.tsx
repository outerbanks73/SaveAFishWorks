"use client";

import { useState, useTransition } from "react";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { formatPrice } from "@/lib/utils/format";
import { createShopifyCart } from "@/lib/shopify/actions";

export function MobileFooter() {
  const { state, computed } = useConfigurator();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (state.items.length === 0) return null;

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      const lines = state.items.map((item) => ({
        merchandiseId: item.product.variantId,
        quantity: item.quantity,
      }));

      const result = await createShopifyCart(lines);
      if ("error" in result) {
        setError(result.error);
      } else {
        window.location.href = result.checkoutUrl;
      }
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-aqua-200 bg-white px-4 py-3 shadow-lg lg:hidden">
      {error && (
        <div className="mb-2 rounded-md bg-red-50 p-2 text-xs text-red-600">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-ocean-900">
            {formatPrice(computed.subtotal)}
          </p>
          <p className="text-xs text-ocean-900/50">
            {computed.totalItems} item{computed.totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isPending}
          className="rounded-lg bg-aqua-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-aqua-700 disabled:opacity-50"
        >
          {isPending ? "Creating cart..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
