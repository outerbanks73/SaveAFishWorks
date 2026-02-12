export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  longDescription: string;
  category: string;
  relatedTerms: string[];
  relatedGuides: string[];
  relatedFish: string[];
  faqs: FAQ[];
}

export interface FAQ {
  question: string;
  answer: string;
}
