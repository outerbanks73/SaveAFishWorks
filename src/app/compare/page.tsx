import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllComparisons } from "@/lib/data/comparisons";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Aquarium Equipment Comparisons",
  description:
    "Side-by-side comparisons of aquarium equipment, fish types, and setups. Make informed decisions for your tank.",
  path: "/compare",
});

export default async function CompareHubPage() {
  const comparisons = await getAllComparisons();
  const breadcrumbs = buildBreadcrumbs([
    { label: "Compare", href: "/compare" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">Comparisons</h1>
      <p className="mb-8 text-gray-600">
        Head-to-head comparisons to help you choose the right equipment and
        setup.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((comp) => (
          <Card
            key={comp.slug}
            title={comp.title}
            description={comp.description}
            href={`/compare/${comp.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
