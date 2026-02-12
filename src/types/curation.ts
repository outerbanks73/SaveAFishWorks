export interface CurationList {
  slug: string;
  title: string;
  description: string;
  intro: string;
  image: string;
  updatedAt: string;
  items: CurationItem[];
  relatedLists: string[];
  relatedGuides: string[];
  targetPersonas: string[];
  faqs: { question: string; answer: string }[];
}

export interface CurationItem {
  productSlug: string;
  rank: number;
  verdict: string;
  bestFor: string;
}
