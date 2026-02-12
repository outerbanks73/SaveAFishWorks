import type { FishSpecies } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedContent } from "@/components/content/RelatedContent";
import { FishSpecsTable } from "@/components/fish/FishSpecsTable";
import { CompatibilityChart } from "@/components/fish/CompatibilityChart";
import { DifficultyBadge } from "@/components/fish/DifficultyBadge";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";
import { faqSchema } from "@/lib/seo/schema";

interface FishProfilePageProps {
  fish: FishSpecies;
}

export function FishProfilePage({ fish }: FishProfilePageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "Fish", href: "/fish" },
    { label: fish.commonName, href: `/fish/${fish.slug}` },
  ]);

  const relatedItems = [
    ...fish.relatedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
    ...fish.relatedProducts.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/products?q=${slug}`,
      type: "Product",
    })),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {fish.faqs.length > 0 && <JsonLd data={faqSchema(fish.faqs)} />}
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ocean-900">
            {fish.commonName}
          </h1>
          <p className="mt-1 text-lg italic text-gray-500">
            {fish.scientificName}
          </p>
        </div>
        <DifficultyBadge difficulty={fish.difficulty} />
      </div>

      <div className="prose prose-gray mb-8 max-w-none">
        {fish.description.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-ocean-900">
            Species Profile
          </h2>
          <FishSpecsTable fish={fish} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-ocean-900">
            Compatibility
          </h2>
          <CompatibilityChart
            compatibleWith={fish.compatibleWith}
            incompatibleWith={fish.incompatibleWith}
          />
        </section>
      </div>

      {fish.careNotes && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold text-ocean-900">
            Care Notes
          </h2>
          <div className="rounded-lg bg-aqua-50 p-4 text-gray-700">
            {fish.careNotes}
          </div>
        </section>
      )}

      {fish.faqs.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-ocean-900">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {fish.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-ocean-800">{faq.question}</dt>
                <dd className="mt-1 text-gray-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <RelatedContent items={relatedItems} />
    </div>
  );
}
