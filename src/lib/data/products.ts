import type { Product, ProductCategory } from "@/types";
import productsData from "@/data/products/products.json";

const products = productsData as unknown as Product[];

const CATEGORIES: ProductCategory[] = [
  { slug: "filters", name: "Filters", description: "Aquarium filtration systems for clean, healthy water.", image: "/images/products/filters.jpg" },
  { slug: "heaters", name: "Heaters", description: "Reliable aquarium heaters for stable water temperature.", image: "/images/products/heaters.jpg" },
  { slug: "lighting", name: "Lighting", description: "LED and fluorescent lighting for fish tanks and planted aquariums.", image: "/images/products/lighting.jpg" },
  { slug: "substrate", name: "Substrate", description: "Gravel, sand, and specialty substrates for your aquarium.", image: "/images/products/substrate.jpg" },
  { slug: "food", name: "Fish Food", description: "Premium fish food for all species and dietary needs.", image: "/images/products/food.jpg" },
  { slug: "decorations", name: "Decorations", description: "Driftwood, rocks, and plants to create stunning aquascapes.", image: "/images/products/decorations.jpg" },
  { slug: "test-kits", name: "Test Kits", description: "Water testing kits to monitor aquarium water parameters.", image: "/images/products/test-kits.jpg" },
  { slug: "treatments", name: "Water Treatments", description: "Water conditioners and treatments for aquarium health.", image: "/images/products/treatments.jpg" },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductSlugs(): { category: string; slug: string }[] {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

export function getAllCategories(): ProductCategory[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
