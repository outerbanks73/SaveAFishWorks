export type Severity = "info" | "warning" | "error";

export interface CompatibilityResult {
  id: string;
  type:
    | "temperature"
    | "ph"
    | "temperament"
    | "bioload"
    | "co2"
    | "schooling"
    | "filter";
  severity: Severity;
  title: string;
  message: string;
  recommendation?: string;
}

export interface LivestockParams {
  title: string;
  temperatureRange?: { min: number; max: number };
  phRange?: { min: number; max: number };
  temperament?: "peaceful" | "semi-aggressive" | "aggressive";
  maxSize?: number;
  schoolingSize?: number;
  quantity: number;
}

export interface PlantParams {
  title: string;
  co2Required?: boolean;
}
