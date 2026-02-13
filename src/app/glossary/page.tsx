import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllGlossaryTerms } from "@/lib/data/glossary";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
  title: "Aquarium Glossary",
  description:
    "A comprehensive glossary of aquarium terms, from the nitrogen cycle to water chemistry. Learn the essential vocabulary every fishkeeper needs.",
  path: "/glossary",
});

export default async function GlossaryHubPage() {
  const terms = await getAllGlossaryTerms();
  const breadcrumbs = buildBreadcrumbs([
    { label: "Glossary", href: "/glossary" },
  ]);

  const categories = [...new Set(terms.map((t) => t.category))].sort();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        Aquarium Glossary
      </h1>
      <p className="mb-8 text-gray-600">
        Essential aquarium terminology explained. Click any term to learn more.
      </p>

      {categories.map((category) => {
        const categoryTerms = terms.filter((t) => t.category === category);
        return (
          <section key={category} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold capitalize text-ocean-800">
              {category.replace(/-/g, " ")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTerms.map((term) => (
                <Card
                  key={term.slug}
                  title={term.term}
                  description={term.definition}
                  href={`/glossary/${term.slug}`}
                  badge={term.category.replace(/-/g, " ")}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
