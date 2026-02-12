import type { CompatibilityResult, LivestockParams, PlantParams } from "./types";

export function checkTemperatureCompatibility(
  livestock: LivestockParams[]
): CompatibilityResult[] {
  const withRange = livestock.filter((l) => l.temperatureRange);
  if (withRange.length < 2) return [];

  let overlapMin = -Infinity;
  let overlapMax = Infinity;

  for (const l of withRange) {
    overlapMin = Math.max(overlapMin, l.temperatureRange!.min);
    overlapMax = Math.min(overlapMax, l.temperatureRange!.max);
  }

  const overlap = overlapMax - overlapMin;

  if (overlap < 0) {
    return [
      {
        id: "temp-no-overlap",
        type: "temperature",
        severity: "error",
        title: "Temperature Incompatibility",
        message:
          "Your selected livestock have no overlapping safe temperature range.",
        recommendation:
          "Consider removing species with conflicting temperature requirements.",
      },
    ];
  }

  if (overlap < 3) {
    return [
      {
        id: "temp-narrow-overlap",
        type: "temperature",
        severity: "warning",
        title: "Narrow Temperature Range",
        message: `Safe overlap is only ${overlap.toFixed(1)}°F (${overlapMin}–${overlapMax}°F). A range of at least 3°F is recommended.`,
        recommendation:
          "Monitor temperature closely and use a reliable heater/chiller.",
      },
    ];
  }

  return [];
}

export function checkPHCompatibility(
  livestock: LivestockParams[]
): CompatibilityResult[] {
  const withRange = livestock.filter((l) => l.phRange);
  if (withRange.length < 2) return [];

  let overlapMin = -Infinity;
  let overlapMax = Infinity;

  for (const l of withRange) {
    overlapMin = Math.max(overlapMin, l.phRange!.min);
    overlapMax = Math.min(overlapMax, l.phRange!.max);
  }

  const overlap = overlapMax - overlapMin;

  if (overlap < 0) {
    return [
      {
        id: "ph-no-overlap",
        type: "ph",
        severity: "error",
        title: "pH Incompatibility",
        message:
          "Your selected livestock have no overlapping safe pH range.",
        recommendation:
          "Consider removing species with conflicting pH requirements.",
      },
    ];
  }

  if (overlap < 0.3) {
    return [
      {
        id: "ph-narrow-overlap",
        type: "ph",
        severity: "warning",
        title: "Narrow pH Range",
        message: `Safe pH overlap is only ${overlap.toFixed(1)} (${overlapMin.toFixed(1)}–${overlapMax.toFixed(1)}). A range of at least 0.3 is recommended.`,
        recommendation: "Test your water pH regularly to stay within the safe zone.",
      },
    ];
  }

  return [];
}

export function checkTemperamentCompatibility(
  livestock: LivestockParams[]
): CompatibilityResult[] {
  const withTemperament = livestock.filter((l) => l.temperament);
  if (withTemperament.length < 2) return [];

  const temperaments = new Set(withTemperament.map((l) => l.temperament!));
  const results: CompatibilityResult[] = [];

  if (temperaments.has("aggressive") && temperaments.has("peaceful")) {
    results.push({
      id: "temperament-aggressive-peaceful",
      type: "temperament",
      severity: "error",
      title: "Aggressive + Peaceful Mix",
      message:
        "Aggressive species will likely harass or harm peaceful tankmates.",
      recommendation:
        "Remove either the aggressive or peaceful species from your build.",
    });
  }

  if (temperaments.has("semi-aggressive") && temperaments.has("peaceful")) {
    const smallPeaceful = withTemperament.filter(
      (l) =>
        l.temperament === "peaceful" && l.maxSize !== undefined && l.maxSize <= 2
    );
    if (smallPeaceful.length > 0) {
      results.push({
        id: "temperament-semi-small",
        type: "temperament",
        severity: "warning",
        title: "Semi-Aggressive + Small Peaceful Fish",
        message: `Small peaceful species (${smallPeaceful.map((l) => l.title).join(", ")}) may be stressed by semi-aggressive tankmates.`,
        recommendation:
          "Ensure plenty of hiding spots and monitor for aggression.",
      });
    }
  }

  return results;
}

export function checkBioload(
  tankGallons: number,
  livestock: LivestockParams[]
): CompatibilityResult[] {
  if (tankGallons <= 0) return [];
  const withSize = livestock.filter((l) => l.maxSize);
  if (withSize.length === 0) return [];

  const totalInches = withSize.reduce(
    (sum, l) => sum + l.maxSize! * l.quantity,
    0
  );
  const loadPercent = (totalInches / tankGallons) * 100;

  if (loadPercent > 100) {
    return [
      {
        id: "bioload-high",
        type: "bioload",
        severity: "error",
        title: "Overstocked Tank",
        message: `Bioload is at ${Math.round(loadPercent)}% capacity (${totalInches}" of fish in ${tankGallons}G). Exceeds the 1 inch per gallon guideline.`,
        recommendation:
          "Reduce the number of fish or upgrade to a larger tank.",
      },
    ];
  }

  if (loadPercent > 60) {
    return [
      {
        id: "bioload-moderate",
        type: "bioload",
        severity: "warning",
        title: "Moderate Bioload",
        message: `Bioload is at ${Math.round(loadPercent)}% capacity (${totalInches}" of fish in ${tankGallons}G).`,
        recommendation:
          "Ensure strong filtration and regular water changes to maintain water quality.",
      },
    ];
  }

  return [
    {
      id: "bioload-ok",
      type: "bioload",
      severity: "info",
      title: "Bioload OK",
      message: `Bioload is at ${Math.round(loadPercent)}% capacity. Your tank has room for the selected livestock.`,
    },
  ];
}

export function checkSchoolingSize(
  livestock: LivestockParams[]
): CompatibilityResult[] {
  const results: CompatibilityResult[] = [];

  for (const l of livestock) {
    if (l.schoolingSize && l.quantity < l.schoolingSize) {
      results.push({
        id: `schooling-${l.title.toLowerCase().replace(/\s+/g, "-")}`,
        type: "schooling",
        severity: "warning",
        title: `${l.title} — Insufficient School Size`,
        message: `You have ${l.quantity} but this species prefers groups of ${l.schoolingSize}+.`,
        recommendation: `Add at least ${l.schoolingSize - l.quantity} more to keep them healthy and less stressed.`,
      });
    }
  }

  return results;
}

export function checkCO2Requirements(
  plants: PlantParams[],
  hasCO2System: boolean
): CompatibilityResult[] {
  const co2Plants = plants.filter((p) => p.co2Required);
  if (co2Plants.length === 0) return [];

  if (!hasCO2System) {
    return [
      {
        id: "co2-missing",
        type: "co2",
        severity: "warning",
        title: "CO2 System Recommended",
        message: `${co2Plants.map((p) => p.title).join(", ")} benefit from CO2 injection, but no CO2 system is in your build.`,
        recommendation:
          "Add a CO2 regulator and diffuser, or consider liquid carbon as an alternative.",
      },
    ];
  }

  return [];
}

export function checkFilterCapacity(
  tankGallons: number,
  hasFilter: boolean
): CompatibilityResult[] {
  if (tankGallons <= 0) return [];

  if (!hasFilter) {
    return [
      {
        id: "filter-missing",
        type: "filter",
        severity: "warning",
        title: "No Filtration Selected",
        message: `A filter rated for at least ${tankGallons * 4} GPH is recommended for a ${tankGallons}G tank (4x turnover).`,
        recommendation: "Add a canister or hang-on-back filter to your build.",
      },
    ];
  }

  return [];
}
