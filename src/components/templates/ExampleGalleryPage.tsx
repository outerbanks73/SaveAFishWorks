import type { ExampleGallery } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RelatedContent } from "@/components/content/RelatedContent";
import { DifficultyBadge } from "@/components/fish/DifficultyBadge";
import { Badge } from "@/components/ui/Badge";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

interface ExampleGalleryPageProps {
  gallery: ExampleGallery;
}

export function ExampleGalleryPage({ gallery }: ExampleGalleryPageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "Examples", href: "/examples" },
    { label: gallery.title, href: `/examples/${gallery.slug}` },
  ]);

  const relatedItems = [
    ...gallery.relatedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
    ...gallery.relatedFish.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/fish/${slug}`,
      type: "Fish",
    })),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        {gallery.title}
      </h1>
      <p className="mb-8 text-gray-600">{gallery.description}</p>

      <div className="space-y-6">
        {gallery.examples.map((example) => (
          <div
            key={example.title}
            className="rounded-lg border border-gray-200 p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <h2 className="text-xl font-semibold text-ocean-900">
                {example.title}
              </h2>
              <DifficultyBadge difficulty={example.difficulty} />
            </div>
            <p className="mb-3 text-gray-600">{example.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {example.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Est. Cost: {example.estimatedCost}</span>
            </div>
          </div>
        ))}
      </div>

      <RelatedContent items={relatedItems} />
    </div>
  );
}
