export interface Persona {
  slug: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  recommendedFish: string[];
  recommendedProducts: string[];
  recommendedGuides: string[];
  recommendedLists: string[];
  tips: string[];
  faqs: { question: string; answer: string }[];
}
