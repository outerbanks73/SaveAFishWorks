"use client";

import { useState } from "react";

interface DynamicListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function DynamicListInput({ label, values, onChange, placeholder = "Add item..." }: DynamicListInputProps) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setDraft("");
    }
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ocean-900">{label}</label>
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-aqua-500 focus:outline-none"
        />
        <button type="button" onClick={add} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-ocean-900 hover:bg-gray-200">
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-aqua-50 px-2.5 py-0.5 text-xs font-medium text-aqua-700">
              {v}
              <button type="button" onClick={() => remove(i)} className="ml-0.5 text-aqua-500 hover:text-red-500">&times;</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
