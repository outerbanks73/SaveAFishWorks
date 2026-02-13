import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ComparisonPage } from "@/components/templates/ComparisonPage";
import {
  getComparisonBySlug,
  getComparisonSlugs,
} from "@/lib/data/comparisons";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getComparisonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return {};

  return generatePageMetadata({
    title: comparison.title,
    description: comparison.description,
    path: `/compare/${slug}`,
  });
}

export default async function ComparisonRoute({ params }: Props) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  return <ComparisonPage comparison={comparison} />;
}
