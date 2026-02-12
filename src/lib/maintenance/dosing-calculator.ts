import { type DosingProduct } from "./dosing-data";

export interface DosingResult {
  product: string;
  brand: string;
  doseAmount: number;
  doseUnit: string;
  frequency: string;
  weeklyTotal: number;
  weeklyUnit: string;
  notes?: string;
}

export interface DosingScheduleOutput {
  doses: DosingResult[];
  waterChangePercent: number;
  method: string;
  notes: string[];
}

const PLANT_LOAD_MULTIPLIER: Record<string, number> = {
  low: 0.5,
  medium: 1.0,
  high: 1.5,
};

function gallonsToLiters(g: number) { return g * 3.785; }

function frequencyToWeekly(freq: string): number {
  if (freq === "daily") return 7;
  if (freq === "3x weekly") return 3;
  if (freq === "2x weekly" || freq === "2-3x weekly") return 2;
  if (freq === "weekly") return 1;
  return 1;
}

export function calculateDosing(options: {
  tankGallons: number;
  method: string;
  product: DosingProduct;
  hasCO2: boolean;
  plantLoad: string;
}): DosingResult {
  const { tankGallons, product, plantLoad } = options;
  const multiplier = PLANT_LOAD_MULTIPLIER[plantLoad] ?? 1.0;

  let volumeRatio: number;
  if (product.baseVolumeUnit === "G") {
    volumeRatio = tankGallons / product.baseVolume;
  } else {
    // Convert tank gallons to liters for comparison
    volumeRatio = gallonsToLiters(tankGallons) / product.baseVolume;
  }

  const doseAmount = Math.round(product.baseAmount * volumeRatio * multiplier * 100) / 100;
  const weeklyDoses = frequencyToWeekly(product.frequency);
  const weeklyTotal = Math.round(doseAmount * weeklyDoses * 100) / 100;

  return {
    product: product.product,
    brand: product.brand,
    doseAmount,
    doseUnit: product.baseUnit,
    frequency: product.frequency,
    weeklyTotal,
    weeklyUnit: product.baseUnit,
    notes: product.notes,
  };
}

export function calculateFullSchedule(options: {
  tankGallons: number;
  method: string;
  products: DosingProduct[];
  hasCO2: boolean;
  plantLoad: string;
}): DosingScheduleOutput {
  const { tankGallons, method, products, hasCO2, plantLoad } = options;

  const doses = products.map((p) =>
    calculateDosing({ tankGallons, method, product: p, hasCO2, plantLoad })
  );

  let waterChangePercent = 25;
  const notes: string[] = [];

  if (method === "EI") {
    waterChangePercent = 50;
    notes.push("EI method requires 50% weekly water change to reset nutrient levels.");
    notes.push("Dose macros (KNO3, KH2PO4, K2SO4) on M/W/F and micros (CSM+B) on T/Th/Sa. Rest Sunday.");
  } else if (method === "PPS_PRO") {
    waterChangePercent = 25;
    notes.push("PPS-Pro aims for minimal nutrient buildup with daily dosing.");
  } else if (method === "ADA") {
    waterChangePercent = 30;
    notes.push("ADA method follows a step-based approach. Adjust dosing as tank matures.");
  }

  if (!hasCO2 && plantLoad === "high") {
    notes.push("High plant load without CO2 may cause algae issues. Consider reducing dosing by 30-50%.");
  }

  return { doses, waterChangePercent, method, notes };
}
