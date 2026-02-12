interface TocItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-2 text-sm font-semibold text-ocean-900">
        Table of Contents
      </h2>
      <ol className="space-y-1">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-aqua-700 hover:text-aqua-900"
            >
              {i + 1}. {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
