"use client";

import { useConfigurator } from "@/context/ConfiguratorContext";
import { CATEGORY_INFO } from "@/types/aquascaping";

interface Props {
  categories: Array<{ name: string; count: number }>;
}

export function CategorySidebar({ categories }: Props) {
  const { state, dispatch } = useConfigurator();

  const hasRequired = CATEGORY_INFO.some((c) => c.required);

  return (
    <aside className="space-y-1">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
        2. Browse Categories
      </h2>
      <button
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_CATEGORY", category: null })
        }
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
          state.activeCategory === null
            ? "bg-aqua-50 font-semibold text-aqua-800"
            : "text-ocean-900/70 hover:bg-aqua-50/50"
        }`}
      >
        <span>All Products</span>
        <span className="text-xs text-ocean-900/40">
          {categories.reduce((sum, c) => sum + c.count, 0)}
        </span>
      </button>
      {categories.map((cat) => {
        const isActive = state.activeCategory === cat.name;
        const itemsInCart =
          state.items.filter((i) => i.product.category === cat.name).length;

        // Match to CATEGORY_INFO by name (case-insensitive partial match)
        const catInfo = CATEGORY_INFO.find(
          (ci) =>
            ci.name.toLowerCase() === cat.name.toLowerCase() ||
            ci.id === cat.name.toLowerCase()
        );

        return (
          <button
            key={cat.name}
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_CATEGORY", category: cat.name })
            }
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              isActive
                ? "bg-aqua-50 font-semibold text-aqua-800"
                : "text-ocean-900/70 hover:bg-aqua-50/50"
            }`}
          >
            <span className="flex items-center gap-2">
              {catInfo && (
                <span className="text-sm" aria-hidden="true">
                  {catInfo.icon}
                </span>
              )}
              {cat.name}
              {catInfo?.required && (
                <span className="text-red-500" title="Required category">
                  *
                </span>
              )}
              {itemsInCart > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-aqua-500 px-1 text-[10px] font-bold text-white">
                  {itemsInCart}
                </span>
              )}
            </span>
            <span className="text-xs text-ocean-900/40">{cat.count}</span>
          </button>
        );
      })}
      {hasRequired && (
        <p className="mt-2 px-3 text-[10px] text-red-500/70">
          * Required categories
        </p>
      )}
    </aside>
  );
}
