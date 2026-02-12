"use client";

import Image from "next/image";
import type { ShopifyProduct } from "@/types/shopify";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";

interface Props {
  product: ShopifyProduct;
}

const CARE_LEVEL_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Easy: "success",
  Medium: "warning",
  Advanced: "danger",
};

export function ShopifyProductCard({ product }: Props) {
  const { state, dispatch } = useConfigurator();

  const inCart = state.items.find((i) => i.product.id === product.id);

  return (
    <div className="group flex flex-col rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-gray-300">
            🌿
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-white">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quantity badge when in cart */}
        {inCart && (
          <div className="absolute right-1.5 top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-aqua-500 px-1.5 text-xs font-bold text-white shadow">
            {inCart.quantity}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] text-ocean-900/40">{product.vendor}</p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-ocean-900">
          {product.title}
        </h3>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {product.careLevel && (
            <Badge variant={CARE_LEVEL_VARIANT[product.careLevel]}>
              {product.careLevel}
            </Badge>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-ocean-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-ocean-900/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {product.availableForSale &&
            (inCart ? (
              <button
                onClick={() =>
                  dispatch({ type: "REMOVE_ITEM", productId: product.id })
                }
                className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => dispatch({ type: "ADD_ITEM", product })}
                className="rounded-md bg-aqua-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-aqua-600"
              >
                Add
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
