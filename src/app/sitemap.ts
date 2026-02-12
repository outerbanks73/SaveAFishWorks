import type { MetadataRoute } from "next";
import { getGlossaryTermSlugs } from "@/lib/data/glossary";
import { getFishSlugs } from "@/lib/data/fish";
import { getGuideSlugs } from "@/lib/data/guides";
import { getProductSlugs, getAllCategories } from "@/lib/data/products";
import { getCurationListSlugs } from "@/lib/data/curation";
import { getPersonaSlugs } from "@/lib/data/personas";
import { getExampleGallerySlugs } from "@/lib/data/examples";
import { getComparisonSlugs } from "@/lib/data/comparisons";

const BASE_URL = "https://learn.aquaticmotiv.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/glossary`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/fish`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/guides`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/products`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/best`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/compare`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/configurator`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/for`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/examples`, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const glossaryPages = getGlossaryTermSlugs().map((slug) => ({
    url: `${BASE_URL}/glossary/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const fishPages = getFishSlugs().map((slug) => ({
    url: `${BASE_URL}/fish/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guidePages = getGuideSlugs().map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryPages = getAllCategories().map((cat) => ({
    url: `${BASE_URL}/products/${cat.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productPages = getProductSlugs().map(({ category, slug }) => ({
    url: `${BASE_URL}/products/${category}/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const curationPages = getCurationListSlugs().map((slug) => ({
    url: `${BASE_URL}/best/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const personaPages = getPersonaSlugs().map((slug) => ({
    url: `${BASE_URL}/for/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const examplePages = getExampleGallerySlugs().map((slug) => ({
    url: `${BASE_URL}/examples/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const comparisonPages = getComparisonSlugs().map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...glossaryPages,
    ...fishPages,
    ...guidePages,
    ...categoryPages,
    ...productPages,
    ...curationPages,
    ...personaPages,
    ...examplePages,
    ...comparisonPages,
  ];
}
