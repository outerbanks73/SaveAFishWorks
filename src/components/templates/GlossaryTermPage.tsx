import type { GlossaryTerm } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedContent } from "@/components/content/RelatedContent";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";
import { definedTermSchema, faqSchema } from "@/lib/seo/schema";

interface GlossaryTermPageProps {
  term: GlossaryTerm;
}

export function GlossaryTermPage({ term }: GlossaryTermPageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "Glossary", href: "/glossary" },
    { label: term.term, href: `/glossary/${term.slug}` },
  ]);

  const relatedItems = [
    ...term.relatedTerms.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/glossary/${slug}`,
      type: "Term",
    })),
    ...term.relatedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
    ...term.relatedFish.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/fish/${slug}`,
      type: "Fish",
    })),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={definedTermSchema(term.term, term.definition)} />
      {term.faqs.length > 0 && <JsonLd data={faqSchema(term.faqs)} />}
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mb-2 text-3xl font-bold text-ocean-900">{term.term}</h1>
      <p className="mb-6 text-lg text-aqua-700">{term.definition}</p>

      <div className="prose prose-gray max-w-none">
        {term.longDescription.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {term.faqs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-ocean-900">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {term.faqs.map((faq) => (
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
