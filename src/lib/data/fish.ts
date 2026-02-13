import type { FishSpecies } from "@/types";
import { prisma } from "@/lib/db";
import speciesData from "@/data/fish/species.json";

const jsonSpecies = speciesData as unknown as FishSpecies[];

function toFish(r: {
  slug: string; commonName: string; scientificName: string; family: string;
  origin: string; description: string; image: string | null; difficulty: string;
  temperament: string; diet: string; lifespan: string; size: string;
  tankSize: string; temperature: string; ph: string; hardness: string;
  waterType: string; careNotes: string; compatibleWith: string[];
  incompatibleWith: string[]; relatedGuides: string[]; relatedProducts: string[];
  faqs: unknown;
}): FishSpecies {
  return {
    slug: r.slug,
    commonName: r.commonName,
    scientificName: r.scientificName,
    family: r.family,
    origin: r.origin,
    description: r.description,
    image: r.image ?? "",
    difficulty: r.difficulty as FishSpecies["difficulty"],
    temperament: r.temperament,
    diet: r.diet,
    lifespan: r.lifespan,
    size: r.size,
    tankSize: r.tankSize,
    temperature: r.temperature,
    ph: r.ph,
    hardness: r.hardness,
    waterType: r.waterType as FishSpecies["waterType"],
    careNotes: r.careNotes,
    compatibleWith: r.compatibleWith,
    incompatibleWith: r.incompatibleWith,
    relatedGuides: r.relatedGuides,
    relatedProducts: r.relatedProducts,
    faqs: (r.faqs as FishSpecies["faqs"]) ?? [],
  };
}

export async function getAllFish(): Promise<FishSpecies[]> {
  try {
    const count = await prisma.fishSpecies.count();
    if (count > 0) {
      const rows = await prisma.fishSpecies.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { commonName: "asc" },
      });
      return rows.map(toFish);
    }
  } catch {
    // fall through
  }
  return jsonSpecies.sort((a, b) => a.commonName.localeCompare(b.commonName));
}

export async function getFishBySlug(slug: string): Promise<FishSpecies | undefined> {
  try {
    const r = await prisma.fishSpecies.findUnique({ where: { slug } });
    if (r) return toFish(r);
  } catch {
    // fall through
  }
  return jsonSpecies.find((f) => f.slug === slug);
}

export async function getFishSlugs(): Promise<string[]> {
  try {
    const count = await prisma.fishSpecies.count();
    if (count > 0) {
      const rows = await prisma.fishSpecies.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    }
  } catch {
    // fall through
  }
  return jsonSpecies.map((f) => f.slug);
}

export async function getFishByWaterType(
  waterType: "freshwater" | "saltwater" | "brackish"
): Promise<FishSpecies[]> {
  const all = await getAllFish();
  return all.filter((f) => f.waterType === waterType);
}

export async function getFishByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): Promise<FishSpecies[]> {
  const all = await getAllFish();
  return all.filter((f) => f.difficulty === difficulty);
}
