export interface ExampleGallery {
  slug: string;
  title: string;
  description: string;
  image: string;
  examples: Example[];
  relatedGuides: string[];
  relatedProducts: string[];
  relatedFish: string[];
}

export interface Example {
  title: string;
  description: string;
  image: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedCost: string;
  fishUsed: string[];
  productsUsed: string[];
}
