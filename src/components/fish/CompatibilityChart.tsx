import Link from "next/link";

interface CompatibilityChartProps {
  compatibleWith: string[];
  incompatibleWith: string[];
}

export function CompatibilityChart({
  compatibleWith,
  incompatibleWith,
}: CompatibilityChartProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-green-800">
          Compatible With
        </h3>
        <ul className="space-y-1">
          {compatibleWith.map((slug) => (
            <li key={slug}>
              <Link
                href={`/fish/${slug}`}
                className="text-sm text-green-700 hover:underline"
              >
                {slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-red-800">
          Not Compatible With
        </h3>
        <ul className="space-y-1">
          {incompatibleWith.map((slug) => (
            <li key={slug}>
              <Link
                href={`/fish/${slug}`}
                className="text-sm text-red-700 hover:underline"
              >
                {slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
