"use client";

import { useConfigurator } from "@/context/ConfiguratorContext";
import { TANK_SIZES } from "@/data/tanks";
import { AQUASCAPE_STYLES } from "@/types/aquascaping";

export function TankSetup() {
  const { state, dispatch } = useConfigurator();

  return (
    <div id="tank-setup" className="space-y-4">
      {/* Configuration Name */}
      <div className="rounded-lg border border-aqua-100 bg-white p-4">
        <label
          htmlFor="config-name"
          className="mb-2 block text-sm font-semibold uppercase tracking-wide text-ocean-900/60"
        >
          Configuration Name
        </label>
        <input
          id="config-name"
          type="text"
          value={state.configurationName}
          onChange={(e) =>
            dispatch({ type: "SET_CONFIGURATION_NAME", name: e.target.value })
          }
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-ocean-900 focus:border-aqua-500 focus:outline-none focus:ring-1 focus:ring-aqua-500"
          placeholder="My Aquascape"
        />
      </div>

      {/* Tank Size Selection */}
      <div className="rounded-lg border border-aqua-100 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
          1. Choose Tank Size
        </h2>
        <div className="flex flex-wrap gap-2">
          {TANK_SIZES.map((tank) => {
            const isActive = state.tank?.id === tank.id;
            return (
              <button
                key={tank.id}
                onClick={() => dispatch({ type: "SET_TANK", tank })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-aqua-500 bg-aqua-50 text-aqua-800"
                    : "border-gray-200 bg-white text-ocean-900/70 hover:border-aqua-300 hover:bg-aqua-50/50"
                }`}
              >
                {tank.gallons > 0 ? (
                  <>
                    <span className="font-semibold">{tank.gallons}G</span>
                    <span className="ml-1.5 text-xs text-ocean-900/50">
                      {tank.dimensions}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">{tank.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Dimensions */}
        {state.tank?.gallons === 0 && (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div>
              <label className="mb-1 block text-xs text-ocean-900/50">
                Length (in)
              </label>
              <input
                type="number"
                min="1"
                value={state.tankDimensions?.length ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_TANK_DIMENSIONS",
                    dimensions: {
                      length: Number(e.target.value),
                      width: state.tankDimensions?.width ?? 0,
                      height: state.tankDimensions?.height ?? 0,
                    },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none focus:ring-1 focus:ring-aqua-500"
                placeholder="24"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ocean-900/50">
                Width (in)
              </label>
              <input
                type="number"
                min="1"
                value={state.tankDimensions?.width ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_TANK_DIMENSIONS",
                    dimensions: {
                      length: state.tankDimensions?.length ?? 0,
                      width: Number(e.target.value),
                      height: state.tankDimensions?.height ?? 0,
                    },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none focus:ring-1 focus:ring-aqua-500"
                placeholder="12"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ocean-900/50">
                Height (in)
              </label>
              <input
                type="number"
                min="1"
                value={state.tankDimensions?.height ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_TANK_DIMENSIONS",
                    dimensions: {
                      length: state.tankDimensions?.length ?? 0,
                      width: state.tankDimensions?.width ?? 0,
                      height: Number(e.target.value),
                    },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-aqua-500 focus:outline-none focus:ring-1 focus:ring-aqua-500"
                placeholder="16"
              />
            </div>
          </div>
        )}

        {state.tank && state.tank.gallons > 0 && (
          <p className="mt-2 text-xs text-ocean-900/50">
            Selected: {state.tank.label} ({state.tank.dimensions})
          </p>
        )}
      </div>

      {/* Aquascape Style */}
      <div className="rounded-lg border border-aqua-100 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
          Aquascape Style
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AQUASCAPE_STYLES.map((style) => {
            const isActive = state.style === style.id;
            return (
              <button
                key={style.id}
                onClick={() =>
                  dispatch({
                    type: "SET_STYLE",
                    style: style.id as typeof state.style,
                  })
                }
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isActive
                    ? "border-aqua-500 bg-aqua-50"
                    : "border-gray-200 bg-white hover:border-aqua-300 hover:bg-aqua-50/50"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${isActive ? "text-aqua-800" : "text-ocean-900/70"}`}
                >
                  {style.name}
                </p>
                <p className="mt-0.5 text-xs text-ocean-900/50">
                  {style.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
