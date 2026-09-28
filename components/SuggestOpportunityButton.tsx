"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const SUGGEST_FORM_URL = "https://forms.gle/demo-suggest-opportunity";

export function SuggestOpportunityButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
      >
        Suggest Opportunity
      </button>

      {open && <SuggestModal onClose={() => setOpen(false)} />}
    </>
  );
}

function SuggestModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-sky-100 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Suggest an Opportunity
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Community organizations can submit opportunities through our external
          form. Submissions are reviewed before being published.
        </p>
        <div className="mt-6 flex justify-end">
          <a
            href={SUGGEST_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="rounded-full bg-sky-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-sky-700"
          >
            Open Submission Form
          </a>
        </div>
      </div>
    </div>
  );
}
