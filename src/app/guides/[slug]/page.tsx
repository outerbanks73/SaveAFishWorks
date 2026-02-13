import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CareGuidePage } from "@/components/templates/CareGuidePage";
import { getGuideBySlug, getGuideSlugs } from "@/lib/data/guides";
import { getGuideBody } from "@/lib/data/guide-content";
import { generatePageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};

  return generatePageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${slug}`,
    type: "article",
  });
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mdxToHtml(mdx: string): {
  html: string;
  headings: { id: string; title: string }[];
} {
  const headings: { id: string; title: string }[] = [];

  const html = mdx
    .split("\n")
    .map((line) => {
      const h2Match = line.match(/^## (.+)$/);
      if (h2Match) {
        const title = h2Match[1];
        const id = slugifyHeading(title);
        headings.push({ id, title });
        return `<h2 id="${id}">${title}</h2>`;
      }

      const h3Match = line.match(/^### (.+)$/);
      if (h3Match) {
        return `<h3>${h3Match[1]}</h3>`;
      }

      if (line.startsWith("- ")) {
        return `<li>${line.slice(2)}</li>`;
      }

      if (line.trim() === "") return "";

      return `<p>${line}</p>`;
    })
    .join("\n");

  return { html, headings };
}

export default async function GuideRoute({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const content = await getGuideBody(slug);
  const { html, headings } = mdxToHtml(content);

  return <CareGuidePage guide={guide} contentHtml={html} headings={headings} />;
}
