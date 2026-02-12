import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExampleGalleryPage } from "@/components/templates/ExampleGalleryPage";
import {
  getExampleGalleryBySlug,
  getExampleGallerySlugs,
} from "@/lib/data/examples";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getExampleGallerySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gallery = getExampleGalleryBySlug(slug);
  if (!gallery) return {};

  return generatePageMetadata({
    title: gallery.title,
    description: gallery.description,
    path: `/examples/${slug}`,
  });
}

export default async function ExampleGalleryRoute({ params }: Props) {
  const { slug } = await params;
  const gallery = getExampleGalleryBySlug(slug);
  if (!gallery) notFound();

  return <ExampleGalleryPage gallery={gallery} />;
}
