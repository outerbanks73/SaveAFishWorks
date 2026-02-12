export default function ConfiguratorLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 h-8 w-64 animate-pulse rounded bg-aqua-100" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr_300px]">
        {/* Sidebar skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded bg-aqua-50"
            />
          ))}
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square animate-pulse rounded-lg bg-aqua-50" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-aqua-50" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-aqua-50" />
            </div>
          ))}
        </div>
        {/* Summary skeleton */}
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-lg bg-aqua-50" />
        </div>
      </div>
    </div>
  );
}
