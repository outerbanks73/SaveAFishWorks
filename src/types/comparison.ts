export interface Comparison {
  slug: string;
  title: string;
  description: string;
  image: string;
  optionA: ComparisonOption;
  optionB: ComparisonOption;
  criteria: ComparisonCriterion[];
  verdict: string;
  relatedComparisons: string[];
  relatedGuides: string[];
  faqs: { question: string; answer: string }[];
}

export interface ComparisonOption {
  name: string;
  description: string;
  image: string;
  pros: string[];
  cons: string[];
}

export interface ComparisonCriterion {
  name: string;
  optionAValue: string;
  optionBValue: string;
  winner: "a" | "b" | "tie";
}
