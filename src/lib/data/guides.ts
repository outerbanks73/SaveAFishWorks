import type { Guide } from "@/types";
import { prisma } from "@/lib/db";
import guidesData from "@/data/guides/guides.json";

const jsonGuides = guidesData as unknown as Guide[];

export async function getAllGuides(): Promise<Guide[]> {
  try {
    const count = await prisma.guide.count();
    if (count > 0) {
      const rows = await prisma.guide.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        description: r.description,
        category: r.category,
        author: r.author,
        publishedAt: r.publishedAt?.toISOString() ?? r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        readingTime: r.readingTime,
        image: r.image ?? "",
        relatedGuides: r.relatedGuides,
        relatedFish: r.relatedFish,
        relatedProducts: r.relatedProducts,
        relatedGlossaryTerms: r.relatedGlossaryTerms,
        faqs: (r.faqs as Guide["faqs"]) ?? [],
      }));
    }
  } catch {
    // DB unavailable — fall through to JSON
  }
  return jsonGuides.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
  try {
    const r = await prisma.guide.findUnique({ where: { slug } });
    if (r) {
      return {
        slug: r.slug,
        title: r.title,
        description: r.description,
        category: r.category,
        author: r.author,
        publishedAt: r.publishedAt?.toISOString() ?? r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        readingTime: r.readingTime,
        image: r.image ?? "",
        relatedGuides: r.relatedGuides,
        relatedFish: r.relatedFish,
        relatedProducts: r.relatedProducts,
        relatedGlossaryTerms: r.relatedGlossaryTerms,
        faqs: (r.faqs as Guide["faqs"]) ?? [],
      };
    }
  } catch {
    // fall through
  }
  return jsonGuides.find((g) => g.slug === slug);
}

export async function getGuideSlugs(): Promise<string[]> {
  try {
    const count = await prisma.guide.count();
    if (count > 0) {
      const rows = await prisma.guide.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    }
  } catch {
    // fall through
  }
  return jsonGuides.map((g) => g.slug);
}

export async function getGuidesByCategory(category: string): Promise<Guide[]> {
  const all = await getAllGuides();
  return all.filter((g) => g.category === category);
}
