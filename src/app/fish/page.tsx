import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DifficultyBadge } from "@/components/fish/DifficultyBadge";
import { Badge } from "@/components/ui/Badge";
import { getAllFish } from "@/lib/data/fish";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Fish Profiles - Freshwater & Saltwater Species",
  description:
    "Detailed care profiles for popular aquarium fish species. Learn about tank requirements, compatibility, diet, and more.",
  path: "/fish",
});

export default function FishHubPage() {
  const fish = getAllFish();
  const breadcrumbs = buildBreadcrumbs([{ label: "Fish", href: "/fish" }]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">Fish Profiles</h1>
      <p className="mb-8 text-gray-600">
        Detailed care guides for popular freshwater and saltwater aquarium
        species.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fish.map((f) => (
          <Link
            key={f.slug}
            href={`/fish/${f.slug}`}
            className="group rounded-lg border border-gray-200 p-4 transition hover:border-aqua-300 hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="info">{f.waterType}</Badge>
              <DifficultyBadge difficulty={f.difficulty} />
            </div>
            <h2 className="font-semibold text-ocean-900 group-hover:text-aqua-700">
              {f.commonName}
            </h2>
            <p className="text-sm italic text-gray-500">{f.scientificName}</p>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {f.description.split("\n\n")[0]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
