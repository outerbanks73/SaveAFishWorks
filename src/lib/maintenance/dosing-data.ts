export interface DosingProduct {
  brand: string;
  product: string;
  method: string;
  baseAmount: number;
  baseUnit: string;
  baseVolume: number;
  baseVolumeUnit: string;
  frequency: string;
  notes?: string;
}

export const DOSING_PRODUCTS: DosingProduct[] = [
  // Tropica
  { brand: "Tropica", product: "Premium Nutrition", method: "ALL_IN_ONE", baseAmount: 1, baseUnit: "ml", baseVolume: 10, baseVolumeUnit: "L", frequency: "weekly", notes: "Micro nutrients for low-tech tanks" },
  { brand: "Tropica", product: "Specialised Nutrition", method: "ALL_IN_ONE", baseAmount: 1, baseUnit: "ml", baseVolume: 10, baseVolumeUnit: "L", frequency: "weekly", notes: "Full macro + micro for planted tanks" },

  // Seachem
  { brand: "Seachem", product: "Flourish", method: "ALL_IN_ONE", baseAmount: 5, baseUnit: "ml", baseVolume: 250, baseVolumeUnit: "L", frequency: "2x weekly" },
  { brand: "Seachem", product: "Flourish Excel", method: "ALL_IN_ONE", baseAmount: 5, baseUnit: "ml", baseVolume: 200, baseVolumeUnit: "L", frequency: "daily" },
  { brand: "Seachem", product: "Flourish Potassium", method: "CUSTOM", baseAmount: 5, baseUnit: "ml", baseVolume: 125, baseVolumeUnit: "L", frequency: "2x weekly" },
  { brand: "Seachem", product: "Flourish Iron", method: "CUSTOM", baseAmount: 5, baseUnit: "ml", baseVolume: 200, baseVolumeUnit: "L", frequency: "2-3x weekly" },
  { brand: "Seachem", product: "Flourish Nitrogen", method: "CUSTOM", baseAmount: 2.5, baseUnit: "ml", baseVolume: 160, baseVolumeUnit: "L", frequency: "2-3x weekly" },
  { brand: "Seachem", product: "Flourish Phosphorus", method: "CUSTOM", baseAmount: 2.5, baseUnit: "ml", baseVolume: 100, baseVolumeUnit: "L", frequency: "2-3x weekly" },

  // APT
  { brand: "2Hr Aquarist", product: "APT Complete", method: "ALL_IN_ONE", baseAmount: 1, baseUnit: "pump", baseVolume: 20, baseVolumeUnit: "L", frequency: "daily", notes: "1 pump = ~1ml. Complete nutrition" },
  { brand: "2Hr Aquarist", product: "APT Zero", method: "ALL_IN_ONE", baseAmount: 1, baseUnit: "pump", baseVolume: 20, baseVolumeUnit: "L", frequency: "daily", notes: "No NPK — for tanks with high bioload" },
  { brand: "2Hr Aquarist", product: "APT Jazz", method: "ALL_IN_ONE", baseAmount: 1, baseUnit: "pump", baseVolume: 20, baseVolumeUnit: "L", frequency: "daily", notes: "Low-tech formula" },

  // ADA
  { brand: "ADA", product: "Brighty K", method: "ADA", baseAmount: 1, baseUnit: "ml", baseVolume: 20, baseVolumeUnit: "L", frequency: "daily", notes: "Potassium supplement" },
  { brand: "ADA", product: "Green Brighty Mineral", method: "ADA", baseAmount: 1, baseUnit: "ml", baseVolume: 20, baseVolumeUnit: "L", frequency: "daily", notes: "Trace elements" },
  { brand: "ADA", product: "Green Brighty Nitrogen", method: "ADA", baseAmount: 1, baseUnit: "ml", baseVolume: 20, baseVolumeUnit: "L", frequency: "daily", notes: "Nitrogen supplement" },

  // NilocG
  { brand: "NilocG", product: "Thrive", method: "ALL_IN_ONE", baseAmount: 1, baseUnit: "pump", baseVolume: 10, baseVolumeUnit: "G", frequency: "daily", notes: "Complete all-in-one" },
  { brand: "NilocG", product: "Thrive+", method: "ALL_IN_ONE", baseAmount: 1, baseUnit: "pump", baseVolume: 10, baseVolumeUnit: "G", frequency: "daily", notes: "Higher concentration for high-tech" },

  // EI dry salts
  { brand: "EI Dry Salts", product: "KNO3 (Potassium Nitrate)", method: "EI", baseAmount: 0.25, baseUnit: "tsp", baseVolume: 20, baseVolumeUnit: "G", frequency: "3x weekly" },
  { brand: "EI Dry Salts", product: "KH2PO4 (Mono Potassium Phosphate)", method: "EI", baseAmount: 0.0625, baseUnit: "tsp", baseVolume: 20, baseVolumeUnit: "G", frequency: "3x weekly" },
  { brand: "EI Dry Salts", product: "K2SO4 (Potassium Sulfate)", method: "EI", baseAmount: 0.25, baseUnit: "tsp", baseVolume: 20, baseVolumeUnit: "G", frequency: "3x weekly" },
  { brand: "EI Dry Salts", product: "CSM+B (Trace Mix)", method: "EI", baseAmount: 0.125, baseUnit: "tsp", baseVolume: 20, baseVolumeUnit: "G", frequency: "3x weekly", notes: "Alternate days with macros" },
];

export const DOSING_METHODS = [
  { id: "EI", name: "Estimative Index", description: "High dose + 50% weekly water change" },
  { id: "PPS_PRO", name: "PPS-Pro", description: "Perpetual Preservation System" },
  { id: "ADA", name: "ADA System", description: "ADA's step-based approach" },
  { id: "ALL_IN_ONE", name: "All-in-One", description: "Single bottle liquid fertilizer" },
  { id: "CUSTOM", name: "Custom", description: "Manual dosing schedule" },
];

export const BRANDS = [...new Set(DOSING_PRODUCTS.map((p) => p.brand))];

export function getProductsByBrand(brand: string) {
  return DOSING_PRODUCTS.filter((p) => p.brand === brand);
}

export function getProductsByMethod(method: string) {
  return DOSING_PRODUCTS.filter((p) => p.method === method);
}
