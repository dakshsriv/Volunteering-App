"use client";

import { useEffect } from "react";
import type { Opportunity } from "@prisma/client";
import { FiMapPin, FiX } from "react-icons/fi";
import { ApplyLink } from "./ApplyLink";

interface OpportunityModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export function OpportunityModal({ opportunity, onClose }: OpportunityModalProps) {
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
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-sky-100 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              {opportunity.category}
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              {opportunity.title}
            </h2>
            <p className="mt-1 text-base font-medium text-sky-700">
              {opportunity.organization}
            </p>
            {opportunity.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {opportunity.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {opportunity.commitment}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {opportunity.hours} hours required
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Description
            </h3>
            <p className="mt-1 text-slate-700">{opportunity.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Requirements
            </h3>
            <p className="mt-1 text-slate-700">{opportunity.requirements}</p>
          </div>

          <p className="flex items-center gap-2 text-sm text-slate-600">
            <FiMapPin className="shrink-0" />
            <span>{opportunity.location}</span>
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <ApplyLink
            opportunityId={opportunity.id}
            href={opportunity.link}
            className="rounded-full bg-sky-600 px-6 py-3 text-center font-medium text-white transition hover:bg-sky-700"
          >
            Apply Externally
          </ApplyLink>
        </div>
      </div>
    </div>
  );
}
