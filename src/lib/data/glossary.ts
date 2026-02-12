import type { GlossaryTerm } from "@/types";
import termsData from "@/data/glossary/terms.json";

const terms = termsData as unknown as GlossaryTerm[];

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return terms.sort((a, b) => a.term.localeCompare(b.term));
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return terms.find((t) => t.slug === slug);
}

export function getGlossaryTermSlugs(): string[] {
  return terms.map((t) => t.slug);
}

export function getGlossaryTermsByCategory(
  category: string
): GlossaryTerm[] {
  return terms.filter((t) => t.category === category);
}
