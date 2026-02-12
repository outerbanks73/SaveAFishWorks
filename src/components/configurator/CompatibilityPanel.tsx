"use client";

import { useMemo, useState } from "react";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { runCompatibilityChecks } from "@/lib/compatibility/engine";
import type { Severity } from "@/lib/compatibility/types";

const SEVERITY_STYLES: Record<
  Severity,
  { border: string; bg: string; icon: string; iconColor: string }
> = {
  error: {
    border: "border-red-200",
    bg: "bg-red-50",
    icon: "●",
    iconColor: "text-red-500",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    icon: "▲",
    iconColor: "text-amber-500",
  },
  info: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    icon: "ℹ",
    iconColor: "text-blue-500",
  },
};

export function CompatibilityPanel() {
  const { state } = useConfigurator();

  const results = useMemo(() => runCompatibilityChecks(state), [state]);

  const hasErrors = results.some((r) => r.severity === "error");
  const [isExpanded, setIsExpanded] = useState(hasErrors);

  // Only render when there are livestock or plant items
  const hasRelevantItems = state.items.some((item) =>
    ["fish", "invertebrates", "plants"].includes(item.product.category)
  );

  if (!hasRelevantItems && results.length === 0) return null;

  const errorCount = results.filter((r) => r.severity === "error").length;
  const warningCount = results.filter((r) => r.severity === "warning").length;

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-ocean-900/60">
          Compatibility Check
        </span>
        <span className="flex items-center gap-1.5">
          {errorCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {errorCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
              {warningCount}
            </span>
          )}
          {results.length === 0 && (
            <span className="text-[10px] text-ocean-900/40">No issues</span>
          )}
          <span className="text-ocean-900/40">
            {isExpanded ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        </span>
      </button>

      {isExpanded && results.length > 0 && (
        <div className="space-y-2 px-3 pb-3">
          {results.map((result) => {
            const style = SEVERITY_STYLES[result.severity];
            return (
              <div
                key={result.id}
                className={`rounded-md border ${style.border} ${style.bg} p-2.5`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 text-sm ${style.iconColor}`}>
                    {style.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800">
                      {result.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-600">
                      {result.message}
                    </p>
                    {result.recommendation && (
                      <p className="mt-1 text-xs italic text-gray-500">
                        {result.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
