import type { CurationList } from "@/types";
import listsData from "@/data/curation/lists.json";

const lists = listsData as unknown as CurationList[];

export function getAllCurationLists(): CurationList[] {
  return lists;
}

export function getCurationListBySlug(slug: string): CurationList | undefined {
  return lists.find((l) => l.slug === slug);
}

export function getCurationListSlugs(): string[] {
  return lists.map((l) => l.slug);
}
