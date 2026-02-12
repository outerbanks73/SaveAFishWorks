import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CurationListPage } from "@/components/templates/CurationListPage";
import {
  getCurationListBySlug,
  getCurationListSlugs,
} from "@/lib/data/curation";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCurationListSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const list = getCurationListBySlug(slug);
  if (!list) return {};

  return generatePageMetadata({
    title: list.title,
    description: list.description,
    path: `/best/${slug}`,
  });
}

export default async function CurationListRoute({ params }: Props) {
  const { slug } = await params;
  const list = getCurationListBySlug(slug);
  if (!list) notFound();

  return <CurationListPage list={list} />;
}
