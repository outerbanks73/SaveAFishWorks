"use client";

import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  fish: { icon: "🐠", label: "Fish", color: "text-blue-600" },
  guide: { icon: "📖", label: "Guide", color: "text-green-600" },
  product: { icon: "🛒", label: "Product", color: "text-purple-600" },
  comparison: { icon: "⚖️", label: "Comparison", color: "text-amber-600" },
  curation: { icon: "🏆", label: "Best Of", color: "text-red-600" },
  glossary: { icon: "📚", label: "Glossary", color: "text-teal-600" },
};

export function SearchResults({ results, query }: { results: SearchResult[]; query: string }) {
  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
        <p className="mt-2 text-sm text-gray-400">Try a different search term.</p>
      </div>
    );
  }

  // Group by type
  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    if (!grouped[r.type]) grouped[r.type] = [];
    grouped[r.type].push(r);
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([type, items]) => {
        const config = TYPE_CONFIG[type] ?? { icon: "📄", label: type, color: "text-gray-600" };
        return (
          <section key={type}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-ocean-900">
              <span>{config.icon}</span>
              {config.label} ({items.length})
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="block rounded-lg border border-gray-200 p-4 transition hover:border-aqua-300 hover:shadow-sm"
                >
                  <p className="font-medium text-ocean-900">{item.title}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  )}
                  <span className={`mt-2 inline-block text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
