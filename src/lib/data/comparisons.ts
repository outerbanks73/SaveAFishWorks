import type { Comparison } from "@/types";
import { prisma } from "@/lib/db";
import comparisonsData from "@/data/comparisons/comparisons.json";

const jsonComparisons = comparisonsData as unknown as Comparison[];

function toComparison(r: {
  slug: string; title: string; description: string; image: string | null;
  optionA: unknown; optionB: unknown; criteria: unknown; verdict: string;
  relatedComparisons: string[]; relatedGuides: string[]; faqs: unknown;
}): Comparison {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    image: r.image ?? "",
    optionA: r.optionA as Comparison["optionA"],
    optionB: r.optionB as Comparison["optionB"],
    criteria: r.criteria as Comparison["criteria"],
    verdict: r.verdict,
    relatedComparisons: r.relatedComparisons,
    relatedGuides: r.relatedGuides,
    faqs: (r.faqs as Comparison["faqs"]) ?? [],
  };
}

export async function getAllComparisons(): Promise<Comparison[]> {
  try {
    const count = await prisma.comparison.count();
    if (count > 0) {
      const rows = await prisma.comparison.findMany({
        where: { status: "PUBLISHED" },
      });
      return rows.map(toComparison);
    }
  } catch {
    // fall through
  }
  return jsonComparisons;
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | undefined> {
  try {
    const r = await prisma.comparison.findUnique({ where: { slug } });
    if (r) return toComparison(r);
  } catch {
    // fall through
  }
  return jsonComparisons.find((c) => c.slug === slug);
}

export async function getComparisonSlugs(): Promise<string[]> {
  try {
    const count = await prisma.comparison.count();
    if (count > 0) {
      const rows = await prisma.comparison.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    }
  } catch {
    // fall through
  }
  return jsonComparisons.map((c) => c.slug);
}
