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

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      }
    } catch {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      router.push(results[activeIndex].url);
      setOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const typeIcons: Record<string, string> = {
    fish: "🐠", guide: "📖", product: "🛒", comparison: "⚖️",
    curation: "🏆", glossary: "📚",
  };

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
        <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-40 bg-transparent text-sm text-ocean-900 outline-none placeholder:text-gray-400 lg:w-56"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          {results.map((result, i) => (
            <button
              key={result.id}
              onClick={() => { router.push(result.url); setOpen(false); setQuery(""); }}
              className={`flex w-full items-start gap-3 px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                i === activeIndex ? "bg-aqua-50" : ""
              }`}
            >
              <span className="mt-0.5 text-base">{typeIcons[result.type] ?? "📄"}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ocean-900">{result.title}</p>
                {result.description && (
                  <p className="truncate text-xs text-gray-500">{result.description}</p>
                )}
                <span className="text-xs capitalize text-aqua-600">{result.type}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
