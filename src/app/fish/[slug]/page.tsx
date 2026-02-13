import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FishProfilePage } from "@/components/templates/FishProfilePage";
import { getFishBySlug, getFishSlugs } from "@/lib/data/fish";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getFishSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fish = await getFishBySlug(slug);
  if (!fish) return {};

  return generatePageMetadata({
    title: `${fish.commonName} (${fish.scientificName}) - Care Guide`,
    description: `Complete care guide for ${fish.commonName}. Learn about tank size, water parameters, diet, compatibility, and more.`,
    path: `/fish/${slug}`,
  });
}

export default async function FishProfileRoute({ params }: Props) {
  const { slug } = await params;
  const fish = await getFishBySlug(slug);
  if (!fish) notFound();

  return <FishProfilePage fish={fish} />;
}
