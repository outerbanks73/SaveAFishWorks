import type { Comparison } from "@/types";
import comparisonsData from "@/data/comparisons/comparisons.json";

const comparisons = comparisonsData as unknown as Comparison[];

export function getAllComparisons(): Comparison[] {
  return comparisons;
}

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}
