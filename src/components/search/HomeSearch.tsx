"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  url: string;
  description?: string;
}

const typeIcons: Record<string, string> = {
  fish: "🐠", guide: "📖", product: "🛒", comparison: "⚖️",
  curation: "🏆", glossary: "📚",
};

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      }
    } catch { setResults([]); }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) { router.push(results[activeIndex].url); setOpen(false); }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative mx-auto max-w-xl">
      <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-aqua-400 focus-within:shadow-md">
        <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search fish, guides, products, and more..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-ocean-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          {results.map((r, i) => (
            <button
              key={r.id}
              onClick={() => { router.push(r.url); setOpen(false); setQuery(""); }}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 ${i === activeIndex ? "bg-aqua-50" : ""}`}
            >
              <span className="mt-0.5 text-lg">{typeIcons[r.type] ?? "📄"}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ocean-900">{r.title}</p>
                {r.description && <p className="truncate text-sm text-gray-500">{r.description}</p>}
                <span className="text-xs capitalize text-aqua-600">{r.type}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
