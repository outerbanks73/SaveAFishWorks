interface RatingProps {
  value: number;
  count?: number;
}

export function Rating({ value, count }: RatingProps) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>
            {i < full ? "\u2605" : i === full && hasHalf ? "\u2605" : "\u2606"}
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
}
