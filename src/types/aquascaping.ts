// Aquascaping product types and interfaces

export type AquascapingCategory =
  | 'substrate'
  | 'rocks'
  | 'driftwood'
  | 'plants'
  | 'lighting'
  | 'filtration'
  | 'co2'
  | 'fertilizers'
  | 'tools'
  | 'fish'
  | 'invertebrates';

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  available: boolean;
  options: Record<string, string>;
}

export interface AquascapingProduct {
  id: string;
  shopifyId: string;
  title: string;
  description: string;
  category: AquascapingCategory;
  subcategory?: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  vendor: string;
  careLevel?: 'beginner' | 'intermediate' | 'advanced';
  lightRequirement?: 'low' | 'medium' | 'high';
  growthRate?: 'slow' | 'medium' | 'fast';
  placement?: 'foreground' | 'midground' | 'background' | 'floating';
  origin?: string;
}

export interface SubstrateProduct extends AquascapingProduct {
  category: 'substrate';
  type: 'active' | 'inert' | 'capping';
  grainSize: string;
  color: string;
  affectsPH: boolean;
  nutrientRich: boolean;
}

export interface RockProduct extends AquascapingProduct {
  category: 'rocks';
  type: 'seiryu' | 'dragon' | 'lava' | 'petrified' | 'slate' | 'other';
  affectsWaterHardness: boolean;
  color: string;
  texture: string;
}

export interface DriftwoodProduct extends AquascapingProduct {
  category: 'driftwood';
  type: 'spiderwood' | 'manzanita' | 'mopani' | 'malaysian' | 'cholla' | 'other';
  releasesTannins: boolean;
  sinks: boolean;
}

export interface PlantProduct extends AquascapingProduct {
  category: 'plants';
  type: 'stem' | 'rosette' | 'rhizome' | 'moss' | 'carpet' | 'floating' | 'bulb';
  scientificName: string;
  co2Required: boolean;
  temperatureRange: { min: number; max: number };
  phRange: { min: number; max: number };
}

export interface LightingProduct extends AquascapingProduct {
  category: 'lighting';
  type: 'led' | 'fluorescent' | 'metal_halide';
  wattage: number;
  spectrum: string;
  coverage: string;
  dimmable: boolean;
  timer: boolean;
}

export interface FiltrationProduct extends AquascapingProduct {
  category: 'filtration';
  type: 'canister' | 'hang_on_back' | 'sponge' | 'internal' | 'sump';
  flowRate: number;
  tankSizeRange: { min: number; max: number };
  mediaIncluded: boolean;
}

export interface CO2Product extends AquascapingProduct {
  category: 'co2';
  type: 'pressurized' | 'diy' | 'liquid' | 'diffuser' | 'regulator' | 'tubing';
}

export interface FertilizerProduct extends AquascapingProduct {
  category: 'fertilizers';
  type: 'all_in_one' | 'macro' | 'micro' | 'root_tabs' | 'iron' | 'potassium';
  dosing: string;
}

export interface ToolProduct extends AquascapingProduct {
  category: 'tools';
  type: 'scissors' | 'tweezers' | 'spatula' | 'net' | 'algae_scraper' | 'thermometer' | 'test_kit' | 'other';
  material: string;
}

export interface LivestockProduct extends AquascapingProduct {
  category: 'fish' | 'invertebrates';
  scientificName: string;
  temperatureRange: { min: number; max: number };
  phRange: { min: number; max: number };
  maxSize: number;
  schoolingSize?: number;
  temperament: 'peaceful' | 'semi-aggressive' | 'aggressive';
  dietType: 'omnivore' | 'herbivore' | 'carnivore';
}

export type AquascapingProductType =
  | SubstrateProduct
  | RockProduct
  | DriftwoodProduct
  | PlantProduct
  | LightingProduct
  | FiltrationProduct
  | CO2Product
  | FertilizerProduct
  | ToolProduct
  | LivestockProduct;

export interface ConfigurationItem {
  product: AquascapingProduct;
  variant: ProductVariant;
  quantity: number;
}

export interface TankConfiguration {
  id: string;
  name: string;
  tankSize: number;
  tankDimensions: {
    length: number;
    width: number;
    height: number;
  };
  style: 'nature' | 'iwagumi' | 'dutch' | 'biotope' | 'paludarium' | 'custom';
  items: ConfigurationItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInfo {
  id: AquascapingCategory;
  name: string;
  description: string;
  icon: string;
  order: number;
  required: boolean;
}

export const CATEGORY_INFO: CategoryInfo[] = [
  {
    id: 'substrate',
    name: 'Substrate',
    description: 'The foundation of your aquascape - choose active or inert substrates',
    icon: '🪨',
    order: 1,
    required: true,
  },
  {
    id: 'rocks',
    name: 'Hardscape - Rocks',
    description: 'Natural rocks to create stunning landscapes',
    icon: '⛰️',
    order: 2,
    required: false,
  },
  {
    id: 'driftwood',
    name: 'Hardscape - Driftwood',
    description: 'Natural wood pieces for structure and character',
    icon: '🪵',
    order: 3,
    required: false,
  },
  {
    id: 'plants',
    name: 'Aquatic Plants',
    description: 'Living plants for a healthy, beautiful aquascape',
    icon: '🌿',
    order: 4,
    required: true,
  },
  {
    id: 'lighting',
    name: 'Lighting',
    description: 'Essential lighting for plant growth and visual appeal',
    icon: '💡',
    order: 5,
    required: true,
  },
  {
    id: 'filtration',
    name: 'Filtration',
    description: 'Keep your water clean and your ecosystem healthy',
    icon: '🌀',
    order: 6,
    required: true,
  },
  {
    id: 'co2',
    name: 'CO2 System',
    description: 'Boost plant growth with CO2 injection',
    icon: '💨',
    order: 7,
    required: false,
  },
  {
    id: 'fertilizers',
    name: 'Fertilizers',
    description: 'Essential nutrients for thriving plants',
    icon: '🧪',
    order: 8,
    required: false,
  },
  {
    id: 'tools',
    name: 'Tools & Accessories',
    description: 'Professional tools for maintenance and planting',
    icon: '🔧',
    order: 9,
    required: false,
  },
  {
    id: 'fish',
    name: 'Fish',
    description: 'Add life and movement to your aquascape',
    icon: '🐟',
    order: 10,
    required: false,
  },
  {
    id: 'invertebrates',
    name: 'Invertebrates',
    description: 'Shrimp, snails, and other helpful critters',
    icon: '🦐',
    order: 11,
    required: false,
  },
];

export const TANK_SIZES = [
  { value: 5, label: '5 Gallon (Nano)' },
  { value: 10, label: '10 Gallon' },
  { value: 20, label: '20 Gallon' },
  { value: 29, label: '29 Gallon' },
  { value: 40, label: '40 Gallon Breeder' },
  { value: 55, label: '55 Gallon' },
  { value: 75, label: '75 Gallon' },
  { value: 90, label: '90 Gallon' },
  { value: 125, label: '125 Gallon' },
  { value: 0, label: 'Custom Size' },
];

export const AQUASCAPE_STYLES = [
  {
    id: 'nature',
    name: 'Nature Style',
    description: 'Mimics natural landscapes with a balance of rocks, wood, and plants',
  },
  {
    id: 'iwagumi',
    name: 'Iwagumi',
    description: 'Japanese rock arrangement style with minimal plant variety',
  },
  {
    id: 'dutch',
    name: 'Dutch Style',
    description: 'Dense, colorful plant arrangements in rows and groups',
  },
  {
    id: 'biotope',
    name: 'Biotope',
    description: 'Recreates a specific natural habitat',
  },
  {
    id: 'paludarium',
    name: 'Paludarium',
    description: 'Combines underwater and above-water elements',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Create your own unique style',
  },
];
