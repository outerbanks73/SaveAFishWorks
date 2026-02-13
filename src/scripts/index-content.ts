import { ensureCollection, indexDocuments } from "../lib/search/index";
import { getAllFish } from "../lib/data/fish";
import { getAllGuides } from "../lib/data/guides";
import { getAllProducts } from "../lib/data/products";
import { getAllComparisons } from "../lib/data/comparisons";
import { getAllCurationLists } from "../lib/data/curation";
import { getAllGlossaryTerms } from "../lib/data/glossary";

async function main() {
  console.log("Ensuring Typesense collection exists...");
  await ensureCollection();

  const documents: Array<{
    id: string;
    title: string;
    description?: string;
    body?: string;
    type: string;
    category?: string;
    slug: string;
    url: string;
    tags?: string[];
  }> = [];

  // Fish
  const fish = await getAllFish();
  for (const f of fish) {
    documents.push({
      id: `fish-${f.slug}`,
      title: f.commonName,
      description: f.scientificName,
      type: "fish",
      category: f.waterType,
      slug: f.slug,
      url: `/fish/${f.slug}`,
      tags: [f.difficulty, f.waterType],
    });
  }
  console.log(`Prepared ${fish.length} fish documents`);

  // Guides
  const guides = await getAllGuides();
  for (const g of guides) {
    documents.push({
      id: `guide-${g.slug}`,
      title: g.title,
      description: g.description,
      type: "guide",
      category: g.category,
      slug: g.slug,
      url: `/guides/${g.slug}`,
      tags: [g.category],
    });
  }
  console.log(`Prepared ${guides.length} guide documents`);

  // Products
  try {
    const products = await getAllProducts();
    for (const p of products) {
      documents.push({
        id: `product-${p.slug}`,
        title: p.name,
        description: p.description,
        type: "product",
        category: p.category,
        slug: p.slug,
        url: `/products/${p.category}/${p.slug}`,
        tags: p.bestFor ?? [],
      });
    }
    console.log(`Prepared ${products.length} product documents`);
  } catch {
    console.log("Skipping products (no data)");
  }

  // Comparisons
  try {
    const comparisons = await getAllComparisons();
    for (const c of comparisons) {
      documents.push({
        id: `comparison-${c.slug}`,
        title: c.title,
        description: c.description,
        type: "comparison",
        slug: c.slug,
        url: `/compare/${c.slug}`,
      });
    }
    console.log(`Prepared ${comparisons.length} comparison documents`);
  } catch {
    console.log("Skipping comparisons (no data)");
  }

  // Curation lists
  try {
    const lists = await getAllCurationLists();
    for (const l of lists) {
      documents.push({
        id: `curation-${l.slug}`,
        title: l.title,
        description: l.description,
        type: "curation",
        slug: l.slug,
        url: `/best/${l.slug}`,
      });
    }
    console.log(`Prepared ${lists.length} curation documents`);
  } catch {
    console.log("Skipping curation lists (no data)");
  }

  // Glossary
  try {
    const terms = await getAllGlossaryTerms();
    for (const t of terms) {
      documents.push({
        id: `glossary-${t.slug}`,
        title: t.term,
        description: t.definition,
        type: "glossary",
        slug: t.slug,
        url: `/glossary#${t.slug}`,
      });
    }
    console.log(`Prepared ${terms.length} glossary documents`);
  } catch {
    console.log("Skipping glossary (no data)");
  }

  console.log(`\nIndexing ${documents.length} total documents...`);
  const count = await indexDocuments(documents);
  console.log(`Successfully indexed ${count} documents!`);
}

main().catch(console.error);
