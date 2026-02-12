"use client";

import { useMemo, useState } from "react";
import type { ShopifyProduct } from "@/types/shopify";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { CATEGORY_INFO } from "@/types/aquascaping";
import { ShopifyProductCard } from "./ShopifyProductCard";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";
type CareLevelFilter = "all" | "Easy" | "Medium" | "Advanced";

interface Props {
  products: ShopifyProduct[];
}

export function ShopifyProductGrid({ products }: Props) {
  const { state } = useConfigurator();
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [careLevelFilter, setCareLevelFilter] =
    useState<CareLevelFilter>("all");

  const catInfo = state.activeCategory
    ? CATEGORY_INFO.find(
        (ci) =>
          ci.name.toLowerCase() === state.activeCategory!.toLowerCase() ||
          ci.id === state.activeCategory!.toLowerCase()
      )
    : null;

  const filtered = useMemo(() => {
    let result = state.activeCategory
      ? products.filter((p) => p.category === state.activeCategory)
      : products;

    if (careLevelFilter !== "all") {
      result = result.filter((p) => p.careLevel === careLevelFilter);
    }

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [products, state.activeCategory, sortBy, careLevelFilter]);

  const hasActiveFilters = careLevelFilter !== "all";

  return (
    <div>
      {/* Category header */}
      {catInfo && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{catInfo.icon}</span>
            <h2 className="text-sm font-semibold text-ocean-900">
              {catInfo.name}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-ocean-900/50">
            {catInfo.description}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
          {catInfo ? "" : "3. Add Products"}
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={careLevelFilter}
            onChange={(e) =>
              setCareLevelFilter(e.target.value as CareLevelFilter)
            }
            className="rounded-md border border-gray-200 px-2 py-1 text-xs text-ocean-900/70 focus:border-aqua-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-md border border-gray-200 px-2 py-1 text-xs text-ocean-900/70 focus:border-aqua-500 focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
          <span className="text-xs text-ocean-900/40">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 text-sm text-ocean-900/40">
          <p>No products match your filters.</p>
          {hasActiveFilters && (
            <button
              onClick={() => setCareLevelFilter("all")}
              className="rounded-md bg-aqua-50 px-3 py-1 text-xs font-medium text-aqua-700 hover:bg-aqua-100"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div
          id="product-grid"
          key={state.activeCategory ?? "all"}
          className="grid grid-cols-2 gap-3 transition-opacity duration-200 md:grid-cols-3"
        >
          {filtered.map((product) => (
            <ShopifyProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
