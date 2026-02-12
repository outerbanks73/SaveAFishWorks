export interface Guide {
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
