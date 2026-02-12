import { formatPrice } from "@/lib/utils/format";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
}

export function PriceDisplay({ price, originalPrice }: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-ocean-900">
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-gray-400 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
