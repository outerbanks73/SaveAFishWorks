import type { FishSpecies } from "@/types";
import speciesData from "@/data/fish/species.json";

const species = speciesData as unknown as FishSpecies[];

export function getAllFish(): FishSpecies[] {
  return species.sort((a, b) => a.commonName.localeCompare(b.commonName));
}

export function getFishBySlug(slug: string): FishSpecies | undefined {
  return species.find((f) => f.slug === slug);
}

export function getFishSlugs(): string[] {
  return species.map((f) => f.slug);
}

export function getFishByWaterType(
  waterType: "freshwater" | "saltwater" | "brackish"
): FishSpecies[] {
  return species.filter((f) => f.waterType === waterType);
}

export function getFishByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): FishSpecies[] {
  return species.filter((f) => f.difficulty === difficulty);
}
