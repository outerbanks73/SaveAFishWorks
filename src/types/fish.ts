export interface FishSpecies {
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  origin: string;
  description: string;
  image: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  temperament: string;
  diet: string;
  lifespan: string;
  size: string;
  tankSize: string;
  temperature: string;
  ph: string;
  hardness: string;
  waterType: "freshwater" | "saltwater" | "brackish";
  careNotes: string;
  compatibleWith: string[];
  incompatibleWith: string[];
  relatedGuides: string[];
  relatedProducts: string[];
  faqs: { question: string; answer: string }[];
}
