import Link from "next/link";

interface RelatedItem {
  title: string;
  href: string;
  type: string;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedItem[];
}

export function RelatedContent({
  title = "Related Content",
  items,
}: RelatedContentProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10 rounded-lg border border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold text-ocean-900">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-aqua-50"
            >
              <span className="rounded bg-aqua-100 px-1.5 py-0.5 text-xs font-medium text-aqua-700">
                {item.type}
              </span>
              <span className="text-ocean-800">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
