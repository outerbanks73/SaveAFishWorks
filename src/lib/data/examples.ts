import type { ExampleGallery } from "@/types";
import galleriesData from "@/data/examples/galleries.json";

const galleries = galleriesData as unknown as ExampleGallery[];

export function getAllExampleGalleries(): ExampleGallery[] {
  return galleries;
}

export function getExampleGalleryBySlug(
  slug: string
): ExampleGallery | undefined {
  return galleries.find((g) => g.slug === slug);
}

export function getExampleGallerySlugs(): string[] {
  return galleries.map((g) => g.slug);
}
