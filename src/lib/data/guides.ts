import type { Guide } from "@/types";
import guidesData from "@/data/guides/guides.json";

const guides = guidesData as unknown as Guide[];

export function getAllGuides(): Guide[] {
  return guides.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

export function getGuidesByCategory(category: string): Guide[] {
  return guides.filter((g) => g.category === category);
}
