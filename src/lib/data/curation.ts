import type { CurationList } from "@/types";
import { prisma } from "@/lib/db";
import listsData from "@/data/curation/lists.json";

const jsonLists = listsData as unknown as CurationList[];

function toList(r: {
  slug: string; title: string; description: string; intro: string;
  image: string | null; items: unknown; relatedLists: string[];
  relatedGuides: string[]; targetPersonas: string[]; faqs: unknown;
  updatedAt: Date;
}): CurationList {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    intro: r.intro,
    image: r.image ?? "",
    updatedAt: r.updatedAt.toISOString(),
    items: r.items as CurationList["items"],
    relatedLists: r.relatedLists,
    relatedGuides: r.relatedGuides,
    targetPersonas: r.targetPersonas,
    faqs: (r.faqs as CurationList["faqs"]) ?? [],
  };
}

export async function getAllCurationLists(): Promise<CurationList[]> {
  try {
    const count = await prisma.curationList.count();
    if (count > 0) {
      const rows = await prisma.curationList.findMany({
        where: { status: "PUBLISHED" },
      });
      return rows.map(toList);
    }
  } catch {
    // fall through
  }
  return jsonLists;
}

export async function getCurationListBySlug(slug: string): Promise<CurationList | undefined> {
  try {
    const r = await prisma.curationList.findUnique({ where: { slug } });
    if (r) return toList(r);
  } catch {
    // fall through
  }
  return jsonLists.find((l) => l.slug === slug);
}

export async function getCurationListSlugs(): Promise<string[]> {
  try {
    const count = await prisma.curationList.count();
    if (count > 0) {
      const rows = await prisma.curationList.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    }
  } catch {
    // fall through
  }
  return jsonLists.map((l) => l.slug);
}
