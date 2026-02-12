import type { ConfiguratorState } from "@/types/configurator";

const STORAGE_KEY = "saveafishworks-configurator";

export function saveConfiguration(state: ConfiguratorState): void {
  if (typeof window === "undefined") return;
  try {
    // Exclude activeCategory (UI-only state) from persistence
    const { activeCategory, ...persistable } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // Private browsing or quota exceeded — silently ignore
  }
}

export function loadConfiguration(): ConfiguratorState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Restore activeCategory as null (not persisted)
    return { ...parsed, activeCategory: null };
  } catch {
    return null;
  }
}

export function clearSavedConfiguration(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore
  }
}
