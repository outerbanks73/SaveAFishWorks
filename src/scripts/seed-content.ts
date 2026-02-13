/**
 * Seed script — imports all static JSON content into the database.
 *
 * Usage:  npx tsx src/scripts/seed-content.ts
 *
 * Idempotent: uses upsert on slug so re-running is safe.
 */

import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function loadJson<T>(relativePath: string): T {
  const fullPath = path.join(process.cwd(), "src/data", relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as T;
}

function loadMdx(slug: string): string {
  const filePath = path.join(process.cwd(), "src/data/guides/content", `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }
  return "";
}

interface GuideJson {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  image: string;
  relatedGuides: string[];
  relatedFish: string[];
  relatedProducts: string[];
  relatedGlossaryTerms: string[];
  faqs: { question: string; answer: string }[];
}

interface FishJson {
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  origin: string;
  description: string;
  image: string;
  difficulty: string;
  temperament: string;
  diet: string;
  lifespan: string;
  size: string;
  tankSize: string;
  temperature: string;
  ph: string;
  hardness: string;
  waterType: string;
  careNotes: string;
  compatibleWith: string[];
  incompatibleWith: string[];
  relatedGuides: string[];
  relatedProducts: string[];
  faqs: { question: string; answer: string }[];
}

interface ProductJson {
  slug: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  pros: string[];
  cons: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  bestFor: string[];
  relatedProducts: string[];
  relatedGuides: string[];
  relatedFish: string[];
}

interface GlossaryJson {
  slug: string;
  term: string;
  definition: string;
  longDescription: string;
  category: string;
  relatedTerms: string[];
  relatedGuides: string[];
  relatedFish: string[];
  faqs: { question: string; answer: string }[];
}

interface ComparisonJson {
  slug: string;
  title: string;
  description: string;
  image: string;
  optionA: unknown;
  optionB: unknown;
  criteria: unknown;
  verdict: string;
  relatedComparisons: string[];
  relatedGuides: string[];
  faqs: { question: string; answer: string }[];
}

interface CurationJson {
  slug: string;
  title: string;
  description: string;
  intro: string;
  image: string;
  updatedAt: string;
  items: unknown[];
  relatedLists: string[];
  relatedGuides: string[];
  targetPersonas: string[];
  faqs: { question: string; answer: string }[];
}

async function main() {
  console.log("Seeding content...\n");

  // Guides
  const guides = loadJson<GuideJson[]>("guides/guides.json");
  console.log(`Seeding ${guides.length} guides...`);
  for (const g of guides) {
    const body = loadMdx(g.slug);
    await prisma.guide.upsert({
      where: { slug: g.slug },
      create: {
        slug: g.slug,
        title: g.title,
        description: g.description,
        category: g.category,
        author: g.author,
        bodyMarkdown: body,
        readingTime: g.readingTime,
        image: g.image || null,
        status: "PUBLISHED",
        publishedAt: new Date(g.publishedAt),
        relatedGuides: g.relatedGuides,
        relatedFish: g.relatedFish,
        relatedProducts: g.relatedProducts,
        relatedGlossaryTerms: g.relatedGlossaryTerms,
        faqs: g.faqs as unknown as Prisma.InputJsonValue,
      },
      update: {
        title: g.title,
        description: g.description,
        category: g.category,
        author: g.author,
        bodyMarkdown: body,
        readingTime: g.readingTime,
        image: g.image || null,
        relatedGuides: g.relatedGuides,
        relatedFish: g.relatedFish,
        relatedProducts: g.relatedProducts,
        relatedGlossaryTerms: g.relatedGlossaryTerms,
        faqs: g.faqs as unknown as Prisma.InputJsonValue,
      },
    });
  }
  console.log("  Done.\n");

  // Fish
  const fish = loadJson<FishJson[]>("fish/species.json");
  console.log(`Seeding ${fish.length} fish species...`);
  for (const f of fish) {
    await prisma.fishSpecies.upsert({
      where: { slug: f.slug },
      create: {
        slug: f.slug,
        commonName: f.commonName,
        scientificName: f.scientificName,
        family: f.family,
        origin: f.origin,
        description: f.description,
        image: f.image || null,
        difficulty: f.difficulty,
        temperament: f.temperament,
        diet: f.diet,
        lifespan: f.lifespan,
        size: f.size,
        tankSize: f.tankSize,
        temperature: f.temperature,
        ph: f.ph,
        hardness: f.hardness,
        waterType: f.waterType,
        careNotes: f.careNotes,
        compatibleWith: f.compatibleWith,
        incompatibleWith: f.incompatibleWith,
        relatedGuides: f.relatedGuides,
        relatedProducts: f.relatedProducts,
        faqs: f.faqs as unknown as Prisma.InputJsonValue,
        status: "PUBLISHED",
      },
      update: {
        commonName: f.commonName,
        scientificName: f.scientificName,
        family: f.family,
        origin: f.origin,
        description: f.description,
        image: f.image || null,
        difficulty: f.difficulty,
        temperament: f.temperament,
        diet: f.diet,
        lifespan: f.lifespan,
        size: f.size,
        tankSize: f.tankSize,
        temperature: f.temperature,
        ph: f.ph,
        hardness: f.hardness,
        waterType: f.waterType,
        careNotes: f.careNotes,
        compatibleWith: f.compatibleWith,
        incompatibleWith: f.incompatibleWith,
        relatedGuides: f.relatedGuides,
        relatedProducts: f.relatedProducts,
        faqs: f.faqs as unknown as Prisma.InputJsonValue,
      },
    });
  }
  console.log("  Done.\n");

  // Products
  const products = loadJson<ProductJson[]>("products/products.json");
  console.log(`Seeding ${products.length} content products...`);
  for (const p of products) {
    await prisma.contentProduct.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        brand: p.brand,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        image: p.image || null,
        features: p.features,
        pros: p.pros,
        cons: p.cons,
        specifications: p.specifications as unknown as Prisma.InputJsonValue,
        inStock: p.inStock,
        bestFor: p.bestFor,
        relatedProducts: p.relatedProducts,
        relatedGuides: p.relatedGuides,
        relatedFish: p.relatedFish,
        status: "PUBLISHED",
      },
      update: {
        name: p.name,
        category: p.category,
        brand: p.brand,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        rating: p.rating,
        reviewCount: p.reviewCount,
        image: p.image || null,
        features: p.features,
        pros: p.pros,
        cons: p.cons,
        specifications: p.specifications as unknown as Prisma.InputJsonValue,
        inStock: p.inStock,
        bestFor: p.bestFor,
        relatedProducts: p.relatedProducts,
        relatedGuides: p.relatedGuides,
        relatedFish: p.relatedFish,
      },
    });
  }
  console.log("  Done.\n");

  // Glossary
  const terms = loadJson<GlossaryJson[]>("glossary/terms.json");
  console.log(`Seeding ${terms.length} glossary terms...`);
  for (const t of terms) {
    await prisma.glossaryTerm.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        term: t.term,
        definition: t.definition,
        longDescription: t.longDescription,
        category: t.category,
        relatedTerms: t.relatedTerms,
        relatedGuides: t.relatedGuides,
        relatedFish: t.relatedFish,
        faqs: t.faqs as unknown as Prisma.InputJsonValue,
        status: "PUBLISHED",
      },
      update: {
        term: t.term,
        definition: t.definition,
        longDescription: t.longDescription,
        category: t.category,
        relatedTerms: t.relatedTerms,
        relatedGuides: t.relatedGuides,
        relatedFish: t.relatedFish,
        faqs: t.faqs as unknown as Prisma.InputJsonValue,
      },
    });
  }
  console.log("  Done.\n");

  // Comparisons
  const comparisons = loadJson<ComparisonJson[]>("comparisons/comparisons.json");
  console.log(`Seeding ${comparisons.length} comparisons...`);
  for (const c of comparisons) {
    await prisma.comparison.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        image: c.image || null,
        optionA: c.optionA as unknown as Prisma.InputJsonValue,
        optionB: c.optionB as unknown as Prisma.InputJsonValue,
        criteria: c.criteria as unknown as Prisma.InputJsonValue,
        verdict: c.verdict,
        relatedComparisons: c.relatedComparisons,
        relatedGuides: c.relatedGuides,
        faqs: c.faqs as unknown as Prisma.InputJsonValue,
        status: "PUBLISHED",
      },
      update: {
        title: c.title,
        description: c.description,
        image: c.image || null,
        optionA: c.optionA as unknown as Prisma.InputJsonValue,
        optionB: c.optionB as unknown as Prisma.InputJsonValue,
        criteria: c.criteria as unknown as Prisma.InputJsonValue,
        verdict: c.verdict,
        relatedComparisons: c.relatedComparisons,
        relatedGuides: c.relatedGuides,
        faqs: c.faqs as unknown as Prisma.InputJsonValue,
      },
    });
  }
  console.log("  Done.\n");

  // Curation Lists
  const lists = loadJson<CurationJson[]>("curation/lists.json");
  console.log(`Seeding ${lists.length} curation lists...`);
  for (const l of lists) {
    await prisma.curationList.upsert({
      where: { slug: l.slug },
      create: {
        slug: l.slug,
        title: l.title,
        description: l.description,
        intro: l.intro,
        image: l.image || null,
        items: l.items as unknown as Prisma.InputJsonValue,
        relatedLists: l.relatedLists,
        relatedGuides: l.relatedGuides,
        targetPersonas: l.targetPersonas,
        faqs: l.faqs as unknown as Prisma.InputJsonValue,
        status: "PUBLISHED",
      },
      update: {
        title: l.title,
        description: l.description,
        intro: l.intro,
        image: l.image || null,
        items: l.items as unknown as Prisma.InputJsonValue,
        relatedLists: l.relatedLists,
        relatedGuides: l.relatedGuides,
        targetPersonas: l.targetPersonas,
        faqs: l.faqs as unknown as Prisma.InputJsonValue,
      },
    });
  }
  console.log("  Done.\n");

  // Configurator Templates
  console.log("Seeding configurator templates...");
  const { templates } = await import("@/data/templates");
  for (const t of templates) {
    await prisma.configuratorTemplate.upsert({
      where: { templateId: t.id },
      create: {
        templateId: t.id,
        name: t.name,
        description: t.description,
        style: t.style,
        tankId: t.tankId,
        difficulty: t.difficulty,
        shopifyProductIds: t.productIds,
        isActive: true,
        sortOrder: 0,
      },
      update: {
        name: t.name,
        description: t.description,
        style: t.style,
        tankId: t.tankId,
        difficulty: t.difficulty,
        shopifyProductIds: t.productIds,
      },
    });
  }
  console.log("  Done.\n");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
