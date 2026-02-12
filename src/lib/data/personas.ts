import type { Persona } from "@/types";
import personasData from "@/data/personas/personas.json";

const personas = personasData as unknown as Persona[];

export function getAllPersonas(): Persona[] {
  return personas;
}

export function getPersonaBySlug(slug: string): Persona | undefined {
  return personas.find((p) => p.slug === slug);
}

export function getPersonaSlugs(): string[] {
  return personas.map((p) => p.slug);
}
