import type { Guide } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedContent } from "@/components/content/RelatedContent";
import { TableOfContents } from "@/components/content/TableOfContents";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";
import { articleSchema, faqSchema } from "@/lib/seo/schema";
import { formatDate } from "@/lib/utils/format";

interface CareGuidePageProps {
  guide: Guide;
  contentHtml: string;
  headings: { id: string; title: string }[];
}

export function CareGuidePage({
  guide,
  contentHtml,
  headings,
}: CareGuidePageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "Guides", href: "/guides" },
    { label: guide.title, href: `/guides/${guide.slug}` },
  ]);

  const relatedItems = [
    ...guide.relatedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
    ...guide.relatedFish.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/fish/${slug}`,
      type: "Fish",
    })),
    ...guide.relatedGlossaryTerms.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/glossary/${slug}`,
      type: "Term",
    })),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={articleSchema({
          title: guide.title,
          description: guide.description,
          url: `https://learn.aquaticmotiv.com/guides/${guide.slug}`,
          image: guide.image,
          publishedAt: guide.publishedAt,
          updatedAt: guide.updatedAt,
          author: guide.author,
        })}
      />
      {guide.faqs.length > 0 && <JsonLd data={faqSchema(guide.faqs)} />}
      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-ocean-900">
          {guide.title}
        </h1>
        <p className="mb-3 text-lg text-gray-600">{guide.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>By {guide.author}</span>
          <span>Updated {formatDate(guide.updatedAt)}</span>
          <span>{guide.readingTime} read</span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_250px]">
        <div>
          <article
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {guide.faqs.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-ocean-900">
                Frequently Asked Questions
              </h2>
              <dl className="space-y-4">
                {guide.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-medium text-ocean-800">
                      {faq.question}
                    </dt>
                    <dd className="mt-1 text-gray-600">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContents items={headings} />
          </div>
        </aside>
      </div>

      <RelatedContent items={relatedItems} />
    </div>
  );
}
