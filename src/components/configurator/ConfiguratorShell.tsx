"use client";

import type { ShopifyProduct } from "@/types/shopify";
import { ConfiguratorProvider } from "@/context/ConfiguratorContext";
import { TankSetup } from "./TankSetup";
import { CategorySidebar } from "./CategorySidebar";
import { ShopifyProductGrid } from "./ShopifyProductGrid";
import { ConfigurationSummary } from "./ConfigurationSummary";
import { MobileFooter } from "./MobileFooter";

interface Props {
  products: ShopifyProduct[];
  categories: Array<{ name: string; count: number }>;
}

export function ConfiguratorShell({ products, categories }: Props) {
  return (
    <ConfiguratorProvider>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ocean-900">
            Aquascape Configurator
          </h1>
          <p className="mt-1 text-sm text-ocean-900/60">
            Select a tank, browse products, and build your perfect aquascape.
          </p>
        </div>

        <TankSetup />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr_300px]">
          <CategorySidebar categories={categories} />
          <ShopifyProductGrid products={products} />
          <ConfigurationSummary />
        </div>

        <MobileFooter />
      </div>
    </ConfiguratorProvider>
  );
}
