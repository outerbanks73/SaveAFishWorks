"use client";

import { useState } from "react";

interface Faq {
  question: string;
  answer: string;
}

interface FaqEditorProps {
  faqs: Faq[];
  onChange: (faqs: Faq[]) => void;
}

export function FaqEditor({ faqs, onChange }: FaqEditorProps) {
  const [draftQ, setDraftQ] = useState("");
  const [draftA, setDraftA] = useState("");

  function add() {
    if (draftQ.trim() && draftA.trim()) {
      onChange([...faqs, { question: draftQ.trim(), answer: draftA.trim() }]);
      setDraftQ("");
      setDraftA("");
    }
  }

  function remove(index: number) {
    onChange(faqs.filter((_, i) => i !== index));
  }

  function update(index: number, field: "question" | "answer", value: string) {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ocean-900">FAQs</label>
      {faqs.map((faq, i) => (
        <div key={i} className="mb-3 rounded-lg border border-gray-200 p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <input
              type="text"
              value={faq.question}
              onChange={(e) => update(i, "question", e.target.value)}
              className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-aqua-500 focus:outline-none"
              placeholder="Question"
            />
            <button type="button" onClick={() => remove(i)} className="text-sm text-red-400 hover:text-red-600">&times;</button>
          </div>
          <textarea
            value={faq.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-aqua-500 focus:outline-none"
            rows={2}
            placeholder="Answer"
          />
        </div>
      ))}
      <div className="rounded-lg border border-dashed border-gray-300 p-3">
        <input
          type="text"
          value={draftQ}
          onChange={(e) => setDraftQ(e.target.value)}
          className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-aqua-500 focus:outline-none"
          placeholder="New question"
        />
        <textarea
          value={draftA}
          onChange={(e) => setDraftA(e.target.value)}
          className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-aqua-500 focus:outline-none"
          rows={2}
          placeholder="Answer"
        />
        <button type="button" onClick={add} className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-ocean-900 hover:bg-gray-200">
          Add FAQ
        </button>
      </div>
    </div>
  );
}
