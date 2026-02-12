import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllExampleGalleries } from "@/lib/data/examples";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Aquarium Setup Examples & Inspiration",
  description:
    "Browse aquarium setup examples and ideas. Get inspired by planted tanks, betta setups, community tanks, and nano aquariums.",
  path: "/examples",
});

export default function ExamplesHubPage() {
  const galleries = getAllExampleGalleries();
  const breadcrumbs = buildBreadcrumbs([
    { label: "Examples", href: "/examples" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        Aquarium Examples & Ideas
      </h1>
      <p className="mb-8 text-gray-600">
        Get inspired by these aquarium setup ideas and build your dream tank.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {galleries.map((gallery) => (
          <Card
            key={gallery.slug}
            title={gallery.title}
            description={gallery.description}
            href={`/examples/${gallery.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
