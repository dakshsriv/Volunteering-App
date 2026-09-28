"use client";

import { useMemo, useState } from "react";
import type { Opportunity } from "@prisma/client";
import {
  COMMITMENT_TYPES,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";
import { OpportunityModal } from "./OpportunityModal";

interface OpportunityListProps {
  opportunities: Opportunity[];
  dbConnected: boolean;
  usingDemoData?: boolean;
}

export function OpportunityList({
  opportunities,
  dbConnected,
  usingDemoData,
}: OpportunityListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [commitmentFilter, setCommitmentFilter] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return opportunities.filter((opp) => {
      const matchesSearch =
        !term ||
        opp.title.toLowerCase().includes(term) ||
        opp.organization.toLowerCase().includes(term);
      const matchesCategory =
        !categoryFilter || opp.category === categoryFilter;
      const matchesCommitment =
        !commitmentFilter || opp.commitment === commitmentFilter;
      return matchesSearch && matchesCategory && matchesCommitment;
    });
  }, [opportunities, search, categoryFilter, commitmentFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-sky-100 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or organization"
          className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:w-44"
        >
          <option value="">All categories</option>
          {VOLUNTEER_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={commitmentFilter}
          onChange={(e) => setCommitmentFilter(e.target.value)}
          className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:w-44"
        >
          <option value="">All commitments</option>
          {COMMITMENT_TYPES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {!dbConnected && (
        <p className="text-sm text-amber-600">
          Database not connected. Set DATABASE_URL to see live opportunities.
        </p>
      )}

      {usingDemoData && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
          Showing sample opportunities. Connect a database to see live listings.
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-white/70 p-10 text-center text-slate-600 shadow-sm">
          No opportunities match your filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((opp) => (
            <article
              key={opp.id}
              onClick={() => setSelected(opp)}
              className="cursor-pointer rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  {opp.category}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {opp.commitment}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                {opp.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-sky-700">
                {opp.organization}
              </p>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                {opp.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">
                  {opp.hours} hours
                </p>
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                >
                  Apply
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <OpportunityModal
          opportunity={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
