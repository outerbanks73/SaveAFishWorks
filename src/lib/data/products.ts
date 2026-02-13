import type { Product, ProductCategory } from "@/types";
import { prisma } from "@/lib/db";
import productsData from "@/data/products/products.json";

const jsonProducts = productsData as unknown as Product[];

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

function toProduct(r: {
  slug: string; name: string; category: string; brand: string; description: string;
  price: number; originalPrice: number | null; rating: number; reviewCount: number;
  image: string | null; features: string[]; pros: string[]; cons: string[];
  specifications: unknown; inStock: boolean; bestFor: string[];
  relatedProducts: string[]; relatedGuides: string[]; relatedFish: string[];
}): Product {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    brand: r.brand,
    description: r.description,
    price: r.price,
    originalPrice: r.originalPrice ?? undefined,
    rating: r.rating,
    reviewCount: r.reviewCount,
    image: r.image ?? "",
    features: r.features,
    pros: r.pros,
    cons: r.cons,
    specifications: (r.specifications as Record<string, string>) ?? {},
    inStock: r.inStock,
    bestFor: r.bestFor,
    relatedProducts: r.relatedProducts,
    relatedGuides: r.relatedGuides,
    relatedFish: r.relatedFish,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const count = await prisma.contentProduct.count();
    if (count > 0) {
      const rows = await prisma.contentProduct.findMany({
        where: { status: "PUBLISHED" },
      });
      return rows.map(toProduct);
    }
  } catch {
    // fall through
  }
  return jsonProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const r = await prisma.contentProduct.findUnique({ where: { slug } });
    if (r) return toProduct(r);
  } catch {
    // fall through
  }
  return jsonProducts.find((p) => p.slug === slug);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category);
}

export async function getProductSlugs(): Promise<{ category: string; slug: string }[]> {
  try {
    const count = await prisma.contentProduct.count();
    if (count > 0) {
      const rows = await prisma.contentProduct.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, category: true },
      });
      return rows.map((r) => ({ category: r.category, slug: r.slug }));
    }
  } catch {
    // fall through
  }
  return jsonProducts.map((p) => ({ category: p.category, slug: p.slug }));
}

export function getAllCategories(): ProductCategory[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
