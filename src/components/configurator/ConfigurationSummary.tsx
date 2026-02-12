"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { formatPrice } from "@/lib/utils/format";
import { createShopifyCart } from "@/lib/shopify/actions";
import { CATEGORY_INFO } from "@/types/aquascaping";
import { CompatibilityPanel } from "./CompatibilityPanel";

const STYLE_LABELS: Record<string, string> = {
  nature: "Nature",
  iwagumi: "Iwagumi",
  dutch: "Dutch",
  biotope: "Biotope",
  paludarium: "Paludarium",
  custom: "Custom",
};

export function ConfigurationSummary() {
  const { state, dispatch, computed } = useConfigurator();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      const lines = state.items.map((item) => ({
        merchandiseId: item.product.variantId,
        quantity: item.quantity,
      }));

      const result = await createShopifyCart(lines);
      if ("error" in result) {
        setError(result.error);
      } else {
        window.location.href = result.checkoutUrl;
      }
    });
  }

  function handleClear() {
    if (confirmClear) {
      dispatch({ type: "CLEAR_ALL" });
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  }

  const categoryEntries = Object.entries(computed.itemsByCategory);

  // Determine missing required categories (only warn when user has added items)
  const requiredCategories = CATEGORY_INFO.filter((c) => c.required);
  const missingRequired =
    state.items.length > 0
      ? requiredCategories.filter(
          (cat) =>
            !state.items.some(
              (item) =>
                item.product.category.toLowerCase() === cat.id ||
                item.product.category.toLowerCase() === cat.name.toLowerCase()
            )
        )
      : [];

  return (
    <aside className="space-y-4">
      {/* Header — clickable to collapse */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center justify-between"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
          {state.configurationName || "Your Build"}
          {computed.totalItems > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-aqua-500 px-1.5 text-[10px] font-bold text-white">
              {computed.totalItems}
            </span>
          )}
        </h2>
        <span className="text-ocean-900/40">
          {isCollapsed ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          )}
        </span>
      </button>

      {!isCollapsed && (
        <>
          {/* Tank info + style */}
          <div className="rounded-lg border border-aqua-100 bg-aqua-50/50 p-3">
            {state.tank ? (
              <div>
                <p className="text-sm font-semibold text-aqua-800">
                  {state.tank.label}
                </p>
                <p className="text-xs text-aqua-700/60">
                  {state.tank.gallons > 0
                    ? state.tank.dimensions
                    : state.tankDimensions
                      ? `${state.tankDimensions.length}" x ${state.tankDimensions.width}" x ${state.tankDimensions.height}"`
                      : "Custom dimensions"}
                  {" · "}
                  {STYLE_LABELS[state.style] ?? state.style} style
                </p>
              </div>
            ) : (
              <p className="text-sm text-ocean-900/40">No tank selected</p>
            )}
          </div>

          {/* Compatibility Panel */}
          <CompatibilityPanel />

          {/* Required category warnings */}
          {missingRequired.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-800">
                Missing required categories:
              </p>
              <ul className="mt-1 space-y-0.5">
                {missingRequired.map((cat) => (
                  <li key={cat.id} className="text-xs text-amber-700">
                    {cat.icon} {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Items */}
          {categoryEntries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-ocean-900/40">
              No products added yet. Browse categories and click Add to start
              building.
            </div>
          ) : (
            <div className="space-y-3">
              {categoryEntries.map(([category, items], index) => (
                <div key={category} className={index > 0 ? "border-t border-gray-50 pt-3" : ""}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ocean-900/40">
                    {category}
                  </p>
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-2 py-1.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ocean-900">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-ocean-900/50">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              productId: item.product.id,
                              quantity: item.quantity - 1,
                            })
                          }
                          className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-bold text-ocean-900/60 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              productId: item.product.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-bold text-ocean-900/60 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Totals + actions */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ocean-900/60">
                {computed.totalItems} item
                {computed.totalItems !== 1 ? "s" : ""}
              </span>
              <span className="text-lg font-bold text-ocean-900">
                {formatPrice(computed.subtotal)}
              </span>
            </div>

            {error && (
              <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-600">
                {error}
              </div>
            )}

            {session && state.items.length > 0 && (
              <button
                onClick={async () => {
                  setSaveStatus("saving");
                  const method = state.saveId ? "PUT" : "POST";
                  const url = state.saveId ? `/api/configurations/${state.saveId}` : "/api/configurations";
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: state.configurationName, data: state }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (!state.saveId) {
                      dispatch({ type: "LOAD_CONFIGURATION", state: { ...state, saveId: data.configuration.id } });
                    }
                    setSaveStatus("saved");
                    setTimeout(() => setSaveStatus("idle"), 2000);
                  } else {
                    setSaveStatus("idle");
                  }
                }}
                disabled={saveStatus === "saving"}
                className="mt-3 w-full rounded-lg border border-aqua-300 bg-aqua-50 py-2.5 text-sm font-semibold text-aqua-700 transition-colors hover:bg-aqua-100 disabled:opacity-50"
              >
                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : state.saveId ? "Update Save" : "Save to Account"}
              </button>
            )}

            <button
              onClick={handleCheckout}
              disabled={state.items.length === 0 || isPending}
              className="mt-3 w-full rounded-lg bg-aqua-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-aqua-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Creating cart..." : "Checkout on Aquatic Motiv"}
            </button>

            {state.items.length > 0 && (
              <button
                onClick={handleClear}
                onBlur={() => setConfirmClear(false)}
                className={`mt-2 w-full rounded-lg border py-2 text-sm transition-colors ${
                  confirmClear
                    ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-gray-200 text-ocean-900/60 hover:bg-gray-50"
                }`}
              >
                {confirmClear ? "Confirm Clear All?" : "Clear All"}
              </button>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
