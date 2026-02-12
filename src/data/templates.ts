import type { AquascapeStyle } from "@/types/configurator";

export interface AquascapeTemplate {
  id: string;
  name: string;
  description: string;
  style: AquascapeStyle;
  tankId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  productIds: string[];
}

export const templates: AquascapeTemplate[] = [
  {
    id: "beginner-nature-20g",
    name: "Beginner Nature 20G",
    description:
      "A balanced nature-style aquascape perfect for beginners. Hardy plants, easy livestock, and reliable equipment.",
    style: "nature",
    tankId: "20g",
    difficulty: "beginner",
    productIds: [
      "sub-001", // ADA Amazonia
      "rock-002", // Dragon Stone
      "wood-001", // Spider Wood
      "plant-001", // Monte Carlo
      "plant-002", // Java Fern
      "plant-003", // Anubias Nana Petite
      "light-001", // Fluval Plant 3.0
      "filter-002", // Fluval 307
      "tool-002", // Tweezers Set
      "tool-004", // API Test Kit
      "fish-001", // Cardinal Tetra
      "invert-001", // Amano Shrimp
    ],
  },
  {
    id: "iwagumi-60p",
    name: "Iwagumi 60P",
    description:
      "Classic Japanese rock arrangement with minimalist carpeting plants. Requires CO2 for optimal carpet growth.",
    style: "iwagumi",
    tankId: "10g",
    difficulty: "intermediate",
    productIds: [
      "sub-001", // ADA Amazonia
      "rock-001", // Seiryu Stone
      "plant-001", // Monte Carlo (carpet)
      "light-002", // Chihiros WRGB II
      "filter-001", // Oase BioMaster
      "co2-001", // CO2Art Regulator
      "co2-002", // Bazooka Diffuser
      "co2-003", // Paintball CO2 Tank
      "fert-002", // Tropica Specialised
    ],
  },
  {
    id: "dutch-garden-40b",
    name: "Dutch Garden 40B",
    description:
      "Dense, colorful plant arrangements in the Dutch tradition. High-tech setup with CO2 and premium lighting.",
    style: "dutch",
    tankId: "40g",
    difficulty: "advanced",
    productIds: [
      "sub-001", // ADA Amazonia
      "plant-001", // Monte Carlo
      "plant-002", // Java Fern
      "plant-003", // Anubias Nana Petite
      "plant-004", // Rotala Rotundifolia
      "plant-005", // Christmas Moss
      "plant-006", // Bucephalandra
      "light-002", // Chihiros WRGB II
      "filter-001", // Oase BioMaster
      "co2-001", // CO2Art Regulator
      "co2-002", // Bazooka Diffuser
      "co2-003", // Paintball CO2 Tank
      "fert-002", // Tropica Specialised
      "fert-003", // Root Tabs
      "tool-001", // ADA Pro Scissors
      "tool-002", // Tweezers Set
      "tool-003", // Substrate Spatula
    ],
  },
  {
    id: "nano-shrimp-paradise",
    name: "Nano Shrimp Paradise",
    description:
      "A tiny planted world for shrimp and snails. Low-maintenance with easy plants and a nano-friendly setup.",
    style: "nature",
    tankId: "5g",
    difficulty: "beginner",
    productIds: [
      "sub-003", // Seachem Flourite (inert)
      "wood-003", // Malaysian Driftwood (sinks)
      "plant-002", // Java Fern
      "plant-003", // Anubias Nana Petite
      "plant-005", // Christmas Moss
      "light-003", // Nicrew ClassicLED
      "filter-003", // AquaClear HOB
      "invert-002", // Cherry Shrimp
      "invert-003", // Nerite Snail
    ],
  },
  {
    id: "blackwater-biotope",
    name: "Blackwater Biotope",
    description:
      "Recreates an Amazonian blackwater habitat with tannin-releasing wood, low-light plants, and South American fish.",
    style: "biotope",
    tankId: "29g",
    difficulty: "intermediate",
    productIds: [
      "sub-003", // Seachem Flourite (inert)
      "sub-004", // Cosmetic Sand
      "wood-003", // Malaysian Driftwood (tannins)
      "wood-002", // Manzanita (tannins)
      "plant-002", // Java Fern
      "plant-005", // Christmas Moss
      "plant-006", // Bucephalandra
      "light-003", // Nicrew ClassicLED (low light)
      "filter-002", // Fluval 307
      "fish-001", // Cardinal Tetra
      "fish-002", // Otocinclus
      "fert-001", // Tropica Premium
    ],
  },
];
