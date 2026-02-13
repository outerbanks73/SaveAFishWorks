"use client";

import { useEffect, useState } from "react";

interface SlugOption {
  slug: string;
  title: string;
}

interface SlugPickerProps {
  label: string;
  endpoint: string;
  selected: string[];
  onChange: (slugs: string[]) => void;
}

export function SlugPicker({ label, endpoint, selected, onChange }: SlugPickerProps) {
  const [options, setOptions] = useState<SlugOption[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(endpoint)
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => {});
  }, [endpoint]);

  const filtered = options.filter(
    (o) =>
      !selected.includes(o.slug) &&
      (o.title.toLowerCase().includes(query.toLowerCase()) ||
        o.slug.toLowerCase().includes(query.toLowerCase()))
  );

  function add(slug: string) {
    onChange([...selected, slug]);
    setQuery("");
  }

  function remove(slug: string) {
    onChange(selected.filter((s) => s !== slug));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ocean-900">{label}</label>
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((s) => {
            const opt = options.find((o) => o.slug === s);
            return (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-aqua-50 px-2.5 py-0.5 text-xs font-medium text-aqua-700">
                {opt?.title ?? s}
                <button type="button" onClick={() => remove(s)} className="ml-0.5 text-aqua-500 hover:text-red-500">&times;</button>
              </span>
            );
          })}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}...`}
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-aqua-500 focus:outline-none"
        />
        {query && filtered.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {filtered.slice(0, 10).map((o) => (
              <li key={o.slug}>
                <button
                  type="button"
                  onClick={() => add(o.slug)}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-aqua-50"
                >
                  <span className="font-medium">{o.title}</span>
                  <span className="ml-2 text-xs text-gray-400">{o.slug}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
