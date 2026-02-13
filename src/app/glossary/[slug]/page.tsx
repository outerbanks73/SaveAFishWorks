import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GlossaryTermPage } from "@/components/templates/GlossaryTermPage";
import {
  getGlossaryTermBySlug,
  getGlossaryTermSlugs,
} from "@/lib/data/glossary";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getGlossaryTermSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);
  if (!term) return {};

  return generatePageMetadata({
    title: `${term.term} - Aquarium Glossary`,
    description: term.definition,
    path: `/glossary/${slug}`,
  });
}

export default async function GlossaryTermRoute({ params }: Props) {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);
  if (!term) notFound();

  return <GlossaryTermPage term={term} />;
}
