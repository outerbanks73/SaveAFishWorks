import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllGuides } from "@/lib/data/guides";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Aquarium Care Guides",
  description:
    "Expert aquarium care guides covering fish care, tank setup, water chemistry, maintenance, and more. Start your fishkeeping journey here.",
  path: "/guides",
});

export default async function GuidesHubPage() {
  const guides = await getAllGuides();
  const breadcrumbs = buildBreadcrumbs([
    { label: "Guides", href: "/guides" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        Aquarium Care Guides
      </h1>
      <p className="mb-8 text-gray-600">
        In-depth guides to help you build and maintain a thriving aquarium.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <Card
            key={guide.slug}
            title={guide.title}
            description={guide.description}
            href={`/guides/${guide.slug}`}
            badge={guide.readingTime}
          />
        ))}
      </div>
    </div>
  );
}
