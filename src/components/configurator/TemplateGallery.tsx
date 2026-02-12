"use client";

import { useState } from "react";
import type { ShopifyProduct } from "@/types/shopify";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { templates } from "@/data/templates";
import { loadTemplate } from "@/lib/templates/load";
import { TANK_SIZES } from "@/data/tanks";
import { Badge } from "@/components/ui/Badge";

interface Props {
  products: ShopifyProduct[];
  onClose: () => void;
}

const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

export function TemplateGallery({ products, onClose }: Props) {
  const { state, loadConfiguration } = useConfigurator();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const hasExistingItems = state.items.length > 0;

  function handleUseTemplate(templateId: string) {
    if (hasExistingItems && confirmId !== templateId) {
      setConfirmId(templateId);
      return;
    }

    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const newState = loadTemplate(template, products);
    loadConfiguration(newState);
    setConfirmId(null);
    onClose();

    // Scroll to tank setup
    setTimeout(() => {
      document
        .getElementById("tank-setup")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="rounded-lg border border-aqua-100 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
          Pre-Built Templates
        </h2>
        <button
          onClick={onClose}
          className="text-xs text-ocean-900/40 hover:text-ocean-900/70"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {templates.map((template) => {
          const tank = TANK_SIZES.find((t) => t.id === template.tankId);
          const isConfirming = confirmId === template.id;

          return (
            <div
              key={template.id}
              className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <h3 className="text-sm font-semibold text-ocean-900">
                  {template.name}
                </h3>
                <Badge variant="info">{template.style}</Badge>
                <Badge variant={DIFFICULTY_VARIANT[template.difficulty]}>
                  {template.difficulty}
                </Badge>
              </div>

              <p className="mb-3 line-clamp-2 text-xs text-ocean-900/60">
                {template.description}
              </p>

              <div className="mb-3 flex items-center gap-3 text-xs text-ocean-900/50">
                {tank && <span>{tank.label}</span>}
                <span>{template.productIds.length} products</span>
              </div>

              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-600">
                    Replace current build?
                  </span>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="rounded-md bg-aqua-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-aqua-600"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-ocean-900/60 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="rounded-md bg-aqua-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-aqua-600"
                >
                  Use This Template
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
