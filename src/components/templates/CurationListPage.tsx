import type { CurationList } from "@/types";
import type { Product } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedContent } from "@/components/content/RelatedContent";
import { buildBreadcrumbs } from "@/lib/linking/breadcrumbs";
import { faqSchema, itemListSchema } from "@/lib/seo/schema";
import { getProductBySlug } from "@/lib/data/products";
import { PriceDisplay } from "@/components/ecommerce/PriceDisplay";
import { Rating } from "@/components/ui/Rating";
import Link from "next/link";

interface CurationListPageProps {
  list: CurationList;
}

export async function CurationListPage({ list }: CurationListPageProps) {
  const breadcrumbs = buildBreadcrumbs([
    { label: "Best Of", href: "/best" },
    { label: list.title, href: `/best/${list.slug}` },
  ]);

  const schemaItems = list.items.map((item, i) => ({
    name: item.productSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    url: `https://learn.aquaticmotiv.com/products`,
    position: i + 1,
  }));

  const relatedItems = [
    ...list.relatedLists.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/best/${slug}`,
      type: "List",
    })),
    ...list.relatedGuides.map((slug) => ({
      title: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: `/guides/${slug}`,
      type: "Guide",
    })),
  ];

  const resolvedItems: Array<{ item: CurationList["items"][number]; product: Product }> = [];
  for (const item of list.items) {
    const product = await getProductBySlug(item.productSlug);
    if (product) resolvedItems.push({ item, product });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={itemListSchema(list.title, schemaItems)} />
      {list.faqs.length > 0 && <JsonLd data={faqSchema(list.faqs)} />}
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mb-2 text-3xl font-bold text-ocean-900">{list.title}</h1>
      <p className="mb-6 text-gray-600">{list.intro}</p>

      <div className="space-y-6">
        {resolvedItems.map(({ item, product }) => (
          <div
            key={item.productSlug}
            className="rounded-lg border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="mb-1 inline-block rounded-full bg-aqua-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  #{item.rank}
                </span>
                <h2 className="text-xl font-semibold text-ocean-900">
                  <Link
                    href={`/products/${product.category}/${product.slug}`}
                    className="hover:text-aqua-700"
                  >
                    {product.name}
                  </Link>
                </h2>
                <span className="text-sm text-gray-500">{product.brand}</span>
              </div>
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
              />
            </div>
            <Rating value={product.rating} count={product.reviewCount} />
            <p className="mt-2 text-gray-600">{item.verdict}</p>
            <p className="mt-1 text-sm text-aqua-700">
              Best for: {item.bestFor}
            </p>
          </div>
        ))}
      </div>

      {list.faqs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-ocean-900">FAQ</h2>
          <dl className="space-y-4">
            {list.faqs.map((faq) => (
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
