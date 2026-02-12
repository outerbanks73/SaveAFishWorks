import type { Persona } from "@/types";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedContent } from "@/components/content/RelatedContent";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";
import { faqSchema } from "@/lib/seo/schema";

interface PersonaLandingPageProps {
  persona: Persona;
}

export function PersonaLandingPage({ persona }: PersonaLandingPageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "For You", href: "/for" },
    { label: persona.title, href: `/for/${persona.slug}` },
  ]);

  const relatedItems = [
    ...persona.recommendedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
    ...persona.recommendedFish.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/fish/${slug}`,
      type: "Fish",
    })),
    ...persona.recommendedLists.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/best/${slug}`,
      type: "Best Of",
    })),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {persona.faqs.length > 0 && <JsonLd data={faqSchema(persona.faqs)} />}
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        {persona.headline}
      </h1>
      <div className="prose prose-gray mb-8 max-w-none">
        {persona.description.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-ocean-900">
          Top Tips
        </h2>
        <ul className="space-y-2">
          {persona.tips.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 rounded-lg border border-aqua-100 bg-aqua-50 p-3"
            >
              <span className="mt-0.5 text-aqua-600">&#10003;</span>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-ocean-900">
          Recommended Fish
        </h2>
        <div className="flex flex-wrap gap-2">
          {persona.recommendedFish.map((slug) => (
            <Link
              key={slug}
              href={`/fish/${slug}`}
              className="rounded-full bg-ocean-100 px-3 py-1 text-sm font-medium text-ocean-800 hover:bg-ocean-200"
            >
              {slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </Link>
          ))}
        </div>
      </section>

      {persona.faqs.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-ocean-900">FAQ</h2>
          <dl className="space-y-4">
            {persona.faqs.map((faq) => (
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
