import type { ConfiguratorState } from "@/types/configurator";
import type { CompatibilityResult } from "./types";
import { extractLivestockParams, extractPlantParams } from "./extract";
import {
  checkTemperatureCompatibility,
  checkPHCompatibility,
  checkTemperamentCompatibility,
  checkBioload,
  checkSchoolingSize,
  checkCO2Requirements,
  checkFilterCapacity,
} from "./checks";

const SEVERITY_ORDER: Record<string, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

export function runCompatibilityChecks(
  state: ConfiguratorState
): CompatibilityResult[] {
  const livestock = extractLivestockParams(state.items);
  const plants = extractPlantParams(state.items);

  // Calculate tank gallons
  let tankGallons = state.tank?.gallons ?? 0;
  if (tankGallons === 0 && state.tankDimensions) {
    const { length, width, height } = state.tankDimensions;
    tankGallons = (length * width * height) / 231;
  }

  const hasCO2System = state.items.some(
    (item) => item.product.category === "co2"
  );
  const hasFilter = state.items.some(
    (item) => item.product.category === "filtration"
  );

  const results: CompatibilityResult[] = [];

  // Run livestock checks only when livestock is present
  if (livestock.length > 0) {
    results.push(...checkTemperatureCompatibility(livestock));
    results.push(...checkPHCompatibility(livestock));
    results.push(...checkTemperamentCompatibility(livestock));
    results.push(...checkSchoolingSize(livestock));

    if (tankGallons > 0) {
      results.push(...checkBioload(tankGallons, livestock));
    }
  }

  // Run plant checks only when plants are present
  if (plants.length > 0) {
    results.push(...checkCO2Requirements(plants, hasCO2System));
  }

  // Run filter check when tank is selected
  if (tankGallons > 0) {
    results.push(...checkFilterCapacity(tankGallons, hasFilter));
  }

  // Sort by severity: error > warning > info
  results.sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3)
  );

  return results;
}
