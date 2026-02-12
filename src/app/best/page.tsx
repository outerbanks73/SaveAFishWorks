import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllCurationLists } from "@/lib/data/curation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Best Aquarium Products & Fish - Curated Lists",
  description:
    "Expert-curated lists of the best aquarium products, fish, and equipment. Find the top-rated gear for your tank.",
  path: "/best",
});

export default function BestOfHubPage() {
  const lists = getAllCurationLists();
  const breadcrumbs = buildBreadcrumbs([
    { label: "Best Of", href: "/best" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        Best Of Lists
      </h1>
      <p className="mb-8 text-gray-600">
        Curated recommendations from our team of aquarium experts.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <Card
            key={list.slug}
            title={list.title}
            description={list.description}
            href={`/best/${list.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
