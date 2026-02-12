import Link from "next/link";
import type { Product } from "@/types";
import { PriceDisplay } from "./PriceDisplay";
import { Rating } from "@/components/ui/Rating";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.category}/${product.slug}`}
      className="group block rounded-lg border border-gray-200 p-4 transition hover:border-aqua-300 hover:shadow-md"
    >
      <div className="mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase">
          {product.brand}
        </span>
        <h3 className="font-semibold text-ocean-900 group-hover:text-aqua-700">
          {product.name}
        </h3>
      </div>
      <Rating value={product.rating} count={product.reviewCount} />
      <div className="mt-2">
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
        />
      </div>
      {!product.inStock && (
        <span className="mt-2 inline-block text-xs text-red-500">
          Out of Stock
        </span>
      )}
    </Link>
  );
}
