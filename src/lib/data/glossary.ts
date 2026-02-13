import type { GlossaryTerm } from "@/types";
import { prisma } from "@/lib/db";
import termsData from "@/data/glossary/terms.json";

const jsonTerms = termsData as unknown as GlossaryTerm[];

function toTerm(r: {
  slug: string; term: string; definition: string; longDescription: string;
  category: string; relatedTerms: string[]; relatedGuides: string[];
  relatedFish: string[]; faqs: unknown;
}): GlossaryTerm {
  return {
    slug: r.slug,
    term: r.term,
    definition: r.definition,
    longDescription: r.longDescription,
    category: r.category,
    relatedTerms: r.relatedTerms,
    relatedGuides: r.relatedGuides,
    relatedFish: r.relatedFish,
    faqs: (r.faqs as GlossaryTerm["faqs"]) ?? [],
  };
}

export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  try {
    const count = await prisma.glossaryTerm.count();
    if (count > 0) {
      const rows = await prisma.glossaryTerm.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { term: "asc" },
      });
      return rows.map(toTerm);
    }
  } catch {
    // fall through
  }
  return jsonTerms.sort((a, b) => a.term.localeCompare(b.term));
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | undefined> {
  try {
    const r = await prisma.glossaryTerm.findUnique({ where: { slug } });
    if (r) return toTerm(r);
  } catch {
    // fall through
  }
  return jsonTerms.find((t) => t.slug === slug);
}

export async function getGlossaryTermSlugs(): Promise<string[]> {
  try {
    const count = await prisma.glossaryTerm.count();
    if (count > 0) {
      const rows = await prisma.glossaryTerm.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    }
  } catch {
    // fall through
  }
  return jsonTerms.map((t) => t.slug);
}

export async function getGlossaryTermsByCategory(category: string): Promise<GlossaryTerm[]> {
  const all = await getAllGlossaryTerms();
  return all.filter((t) => t.category === category);
}
