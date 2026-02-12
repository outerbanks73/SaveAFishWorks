export interface Product {
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

export interface ProductCategory {
  slug: string;
  name: string;
  description: string;
  image: string;
}
