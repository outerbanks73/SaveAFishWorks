import type { ConfiguratorItem } from "@/types/configurator";
import type { LivestockParams, PlantParams } from "./types";
import { getProductById } from "@/data/sampleProducts";
import type { LivestockProduct, PlantProduct } from "@/types/aquascaping";

const LIVESTOCK_CATEGORIES = ["fish", "invertebrates"];
const PLANT_CATEGORY = "plants";

export function extractLivestockParams(
  items: ConfiguratorItem[]
): LivestockParams[] {
  return items
    .filter((item) => LIVESTOCK_CATEGORIES.includes(item.product.category))
    .map((item) => {
      const sampleProduct = getProductById(item.product.id) as
        | LivestockProduct
        | undefined;

      return {
        title: item.product.title,
        temperatureRange: sampleProduct?.temperatureRange,
        phRange: sampleProduct?.phRange,
        temperament: sampleProduct?.temperament,
        maxSize: sampleProduct?.maxSize,
        schoolingSize: sampleProduct?.schoolingSize,
        quantity: item.quantity,
      };
    });
}

export function extractPlantParams(items: ConfiguratorItem[]): PlantParams[] {
  return items
    .filter((item) => item.product.category === PLANT_CATEGORY)
    .map((item) => {
      const sampleProduct = getProductById(item.product.id) as
        | PlantProduct
        | undefined;

      return {
        title: item.product.title,
        co2Required: sampleProduct?.co2Required,
      };
    });
}
