import Link from "next/link";
import { getAllFish } from "@/lib/data/fish";
import { getAllGuides } from "@/lib/data/guides";
import { getAllCurationLists } from "@/lib/data/curation";
import { Card } from "@/components/ui/Card";
import { DifficultyBadge } from "@/components/fish/DifficultyBadge";

const SECTIONS = [
  { title: "Fish Profiles", href: "/fish", description: "Detailed care profiles for popular aquarium species" },
  { title: "Care Guides", href: "/guides", description: "Expert guides for tank setup, maintenance, and fish care" },
  { title: "Products", href: "/products", description: "Reviews and recommendations for aquarium equipment" },
  { title: "Best Of Lists", href: "/best", description: "Curated picks from our team of aquarium experts" },
  { title: "Comparisons", href: "/compare", description: "Head-to-head equipment and setup comparisons" },
  { title: "Glossary", href: "/glossary", description: "Essential aquarium terminology explained" },
];

export default function HomePage() {
  const fish = getAllFish().slice(0, 6);
  const guides = getAllGuides().slice(0, 4);
  const lists = getAllCurationLists().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-ocean-900 md:text-5xl">
          Your Complete Aquarium Resource
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Expert fish care guides, species profiles, product reviews, and
          everything you need to build a thriving aquarium.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/for/beginners"
            className="rounded-lg bg-aqua-600 px-6 py-3 font-medium text-white hover:bg-aqua-700"
          >
            Start Here
          </Link>
          <Link
            href="/fish"
            className="rounded-lg border border-aqua-300 px-6 py-3 font-medium text-aqua-700 hover:bg-aqua-50"
          >
            Browse Fish
          </Link>
        </div>
      </section>

      {/* Quick links grid */}
      <section className="mb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-lg border border-gray-200 p-5 transition hover:border-aqua-300 hover:shadow-md"
            >
              <h2 className="font-semibold text-ocean-900 group-hover:text-aqua-700">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Fish */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ocean-900">Popular Fish</h2>
          <Link
            href="/fish"
            className="text-sm font-medium text-aqua-600 hover:text-aqua-700"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fish.map((f) => (
            <Link
              key={f.slug}
              href={`/fish/${f.slug}`}
              className="group rounded-lg border border-gray-200 p-4 transition hover:border-aqua-300 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">{f.waterType}</span>
                <DifficultyBadge difficulty={f.difficulty} />
              </div>
              <h3 className="font-semibold text-ocean-900 group-hover:text-aqua-700">
                {f.commonName}
              </h3>
              <p className="text-sm italic text-gray-500">
                {f.scientificName}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Guides */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ocean-900">Latest Guides</h2>
          <Link
            href="/guides"
            className="text-sm font-medium text-aqua-600 hover:text-aqua-700"
          >
            View all &rarr;
          </Link>
        </div>
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
      </section>

      {/* Top Lists */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ocean-900">Top Picks</h2>
          <Link
            href="/best"
            className="text-sm font-medium text-aqua-600 hover:text-aqua-700"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {lists.map((list) => (
            <Card
              key={list.slug}
              title={list.title}
              description={list.description}
              href={`/best/${list.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
