import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PersonaLandingPage } from "@/components/templates/PersonaLandingPage";
import { getPersonaBySlug, getPersonaSlugs } from "@/lib/data/personas";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPersonaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const persona = getPersonaBySlug(slug);
  if (!persona) return {};

  return generatePageMetadata({
    title: persona.title,
    description: persona.headline,
    path: `/for/${slug}`,
  });
}

export default async function PersonaRoute({ params }: Props) {
  const { slug } = await params;
  const persona = getPersonaBySlug(slug);
  if (!persona) notFound();

  return <PersonaLandingPage persona={persona} />;
}
