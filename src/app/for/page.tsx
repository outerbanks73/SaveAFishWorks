import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllPersonas } from "@/lib/data/personas";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Aquarium Guides by Experience Level",
  description:
    "Tailored aquarium recommendations for beginners, kids, advanced hobbyists, and planted tank enthusiasts.",
  path: "/for",
});

export default function PersonasHubPage() {
  const personas = getAllPersonas();
  const breadcrumbs = buildBreadcrumbs([
    { label: "For You", href: "/for" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        Recommendations For You
      </h1>
      <p className="mb-8 text-gray-600">
        Tailored guides and recommendations based on your experience level and
        interests.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {personas.map((persona) => (
          <Card
            key={persona.slug}
            title={persona.title}
            description={persona.headline}
            href={`/for/${persona.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
