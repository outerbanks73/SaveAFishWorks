import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  type BreadcrumbItem,
  breadcrumbsToSchemaItems,
} from "@/lib/linking/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/schema";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = breadcrumbsToSchemaItems(items);

  return (
    <>
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && <span className="mx-1">/</span>}
              {i === items.length - 1 ? (
                <span className="text-ocean-900">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-aqua-600">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
