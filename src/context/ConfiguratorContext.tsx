"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type {
  ConfiguratorState,
  ConfiguratorAction,
  ConfiguratorComputed,
  ConfiguratorItem,
  TankSize,
  TankDimensions,
  AquascapeStyle,
} from "@/types/configurator";
import type { ShopifyProduct } from "@/types/shopify";
import {
  saveConfiguration,
  loadConfiguration as loadSavedConfiguration,
  clearSavedConfiguration,
} from "@/lib/storage/configurator-storage";

function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction
): ConfiguratorState {
  switch (action.type) {
    case "SET_TANK":
      return { ...state, tank: action.tank };

    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId
        ),
      };

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }

    case "SET_ACTIVE_CATEGORY":
      return { ...state, activeCategory: action.category };

    case "CLEAR_ALL":
      clearSavedConfiguration();
      return {
        ...state,
        tank: null,
        items: [],
        tankDimensions: null,
        style: "nature",
        configurationName: "My Aquascape",
      };

    case "SET_TANK_DIMENSIONS":
      return { ...state, tankDimensions: action.dimensions };

    case "SET_STYLE":
      return { ...state, style: action.style };

    case "SET_CONFIGURATION_NAME":
      return { ...state, configurationName: action.name };

    case "LOAD_CONFIGURATION":
      return { ...action.state };

    default:
      return state;
  }
}

const initialState: ConfiguratorState = {
  tank: null,
  tankDimensions: null,
  style: "nature",
  items: [],
  activeCategory: null,
  configurationName: "My Aquascape",
};

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  dispatch: React.Dispatch<ConfiguratorAction>;
  computed: ConfiguratorComputed;
  // Convenience methods
  setTankSize: (tank: TankSize) => void;
  setTankDimensions: (dimensions: TankDimensions) => void;
  setStyle: (style: AquascapeStyle) => void;
  addItem: (product: ShopifyProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setActiveCategory: (category: string | null) => void;
  setConfigurationName: (name: string) => void;
  clearConfiguration: () => void;
  loadConfiguration: (config: ConfiguratorState) => void;
  hasItemsInCategory: (category: string) => boolean;
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialState);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved configuration on mount
  useEffect(() => {
    const saved = loadSavedConfiguration();
    if (saved && saved.items.length > 0) {
      dispatch({ type: "LOAD_CONFIGURATION", state: saved });
    }
  }, []);

  // Auto-save with 500ms debounce
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveConfiguration(state);
    }, 500);
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [state]);

  const computed = useMemo<ConfiguratorComputed>(() => {
    const totalItems = state.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const itemsByCategory: Record<string, ConfiguratorItem[]> = {};
    for (const item of state.items) {
      const cat = item.product.category;
      if (!itemsByCategory[cat]) {
        itemsByCategory[cat] = [];
      }
      itemsByCategory[cat].push(item);
    }

    return { totalItems, subtotal, itemsByCategory };
  }, [state.items]);

  const setTankSize = useCallback(
    (tank: TankSize) => dispatch({ type: "SET_TANK", tank }),
    []
  );
  const setTankDimensions = useCallback(
    (dimensions: TankDimensions) =>
      dispatch({ type: "SET_TANK_DIMENSIONS", dimensions }),
    []
  );
  const setStyle = useCallback(
    (style: AquascapeStyle) => dispatch({ type: "SET_STYLE", style }),
    []
  );
  const addItem = useCallback(
    (product: ShopifyProduct) => dispatch({ type: "ADD_ITEM", product }),
    []
  );
  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE_ITEM", productId }),
    []
  );
  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    []
  );
  const setActiveCategory = useCallback(
    (category: string | null) =>
      dispatch({ type: "SET_ACTIVE_CATEGORY", category }),
    []
  );
  const setConfigurationName = useCallback(
    (name: string) => dispatch({ type: "SET_CONFIGURATION_NAME", name }),
    []
  );
  const clearConfiguration = useCallback(
    () => dispatch({ type: "CLEAR_ALL" }),
    []
  );
  const loadConfiguration = useCallback(
    (config: ConfiguratorState) =>
      dispatch({ type: "LOAD_CONFIGURATION", state: config }),
    []
  );
  const hasItemsInCategory = useCallback(
    (category: string) =>
      state.items.some((item) => item.product.category === category),
    [state.items]
  );

  return (
    <ConfiguratorContext
      value={{
        state,
        dispatch,
        computed,
        setTankSize,
        setTankDimensions,
        setStyle,
        addItem,
        removeItem,
        updateQuantity,
        setActiveCategory,
        setConfigurationName,
        clearConfiguration,
        loadConfiguration,
        hasItemsInCategory,
      }}
    >
      {children}
    </ConfiguratorContext>
  );
}

export function useConfigurator(): ConfiguratorContextValue {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) {
    throw new Error("useConfigurator must be used within ConfiguratorProvider");
  }
  return ctx;
}
