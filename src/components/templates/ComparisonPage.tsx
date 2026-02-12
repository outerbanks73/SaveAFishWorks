import type { Comparison } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedContent } from "@/components/content/RelatedContent";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";
import { faqSchema } from "@/lib/seo/schema";

interface ComparisonPageProps {
  comparison: Comparison;
}

export function ComparisonPage({ comparison }: ComparisonPageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "Compare", href: "/compare" },
    { label: comparison.title, href: `/compare/${comparison.slug}` },
  ]);

  const relatedItems = [
    ...comparison.relatedComparisons.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/compare/${slug}`,
      type: "Compare",
    })),
    ...comparison.relatedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {comparison.faqs.length > 0 && (
        <JsonLd data={faqSchema(comparison.faqs)} />
      )}
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mb-2 text-3xl font-bold text-ocean-900">
        {comparison.title}
      </h1>
      <p className="mb-8 text-gray-600">{comparison.description}</p>

      {/* Side-by-side overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="mb-2 text-xl font-semibold text-ocean-900">
            {comparison.optionA.name}
          </h2>
          <p className="mb-3 text-sm text-gray-600">
            {comparison.optionA.description}
          </p>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-green-700">Pros</h3>
              <ul className="mt-1 space-y-1">
                {comparison.optionA.pros.map((p) => (
                  <li key={p} className="text-sm text-gray-600">+ {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-700">Cons</h3>
              <ul className="mt-1 space-y-1">
                {comparison.optionA.cons.map((c) => (
                  <li key={c} className="text-sm text-gray-600">- {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="mb-2 text-xl font-semibold text-ocean-900">
            {comparison.optionB.name}
          </h2>
          <p className="mb-3 text-sm text-gray-600">
            {comparison.optionB.description}
          </p>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-green-700">Pros</h3>
              <ul className="mt-1 space-y-1">
                {comparison.optionB.pros.map((p) => (
                  <li key={p} className="text-sm text-gray-600">+ {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-700">Cons</h3>
              <ul className="mt-1 space-y-1">
                {comparison.optionB.cons.map((c) => (
                  <li key={c} className="text-sm text-gray-600">- {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-ocean-900">
          Head-to-Head Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-aqua-200">
                <th className="py-2 text-left font-medium text-gray-600">
                  Criteria
                </th>
                <th className="py-2 text-left font-medium text-ocean-900">
                  {comparison.optionA.name}
                </th>
                <th className="py-2 text-left font-medium text-ocean-900">
                  {comparison.optionB.name}
                </th>
                <th className="py-2 text-left font-medium text-gray-600">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.criteria.map((c) => (
                <tr key={c.name} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-gray-700">{c.name}</td>
                  <td
                    className={`py-2 ${c.winner === "a" ? "font-semibold text-aqua-700" : "text-gray-600"}`}
                  >
                    {c.optionAValue}
                  </td>
                  <td
                    className={`py-2 ${c.winner === "b" ? "font-semibold text-aqua-700" : "text-gray-600"}`}
                  >
                    {c.optionBValue}
                  </td>
                  <td className="py-2 text-gray-500">
                    {c.winner === "tie"
                      ? "Tie"
                      : c.winner === "a"
                        ? comparison.optionA.name
                        : comparison.optionB.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8 rounded-lg bg-aqua-50 p-5">
        <h2 className="mb-2 text-lg font-semibold text-ocean-900">
          Our Verdict
        </h2>
        <p className="text-gray-700">{comparison.verdict}</p>
      </section>

      {comparison.faqs.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-ocean-900">FAQ</h2>
          <dl className="space-y-4">
            {comparison.faqs.map((faq) => (
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
