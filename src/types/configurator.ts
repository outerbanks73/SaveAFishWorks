import type { ShopifyProduct } from "./shopify";

export interface TankSize {
  id: string;
  label: string;
  gallons: number;
  dimensions: string; // e.g. "24\" x 12\" x 16\""
}

export interface TankDimensions {
  length: number;
  width: number;
  height: number;
}

export type AquascapeStyle =
  | "nature"
  | "iwagumi"
  | "dutch"
  | "biotope"
  | "paludarium"
  | "custom";

export interface ConfiguratorItem {
  product: ShopifyProduct;
  quantity: number;
  selectedVariantId?: string;
}

export interface ConfiguratorState {
  tank: TankSize | null;
  tankDimensions: TankDimensions | null;
  style: AquascapeStyle;
  items: ConfiguratorItem[];
  activeCategory: string | null;
  configurationName: string;
  saveId?: string;
}

export type ConfiguratorAction =
  | { type: "SET_TANK"; tank: TankSize }
  | { type: "ADD_ITEM"; product: ShopifyProduct }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "SET_ACTIVE_CATEGORY"; category: string | null }
  | { type: "CLEAR_ALL" }
  | { type: "SET_TANK_DIMENSIONS"; dimensions: TankDimensions }
  | { type: "SET_STYLE"; style: AquascapeStyle }
  | { type: "SET_CONFIGURATION_NAME"; name: string }
  | { type: "LOAD_CONFIGURATION"; state: ConfiguratorState };

export interface ConfiguratorComputed {
  totalItems: number;
  subtotal: number;
  itemsByCategory: Record<string, ConfiguratorItem[]>;
}
