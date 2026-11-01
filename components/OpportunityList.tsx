"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Opportunity } from "@prisma/client";
import {
  BADGES,
  COMMITMENT_TYPES,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";

interface OpportunityListProps {
  opportunities: Opportunity[];
}

export function OpportunityList({ opportunities }: OpportunityListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [commitmentFilter, setCommitmentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [minimumHours, setMinimumHours] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return opportunities.filter((opp) => {
      const matchesSearch =
        !term ||
        opp.title.toLowerCase().includes(term) ||
        opp.organization.toLowerCase().includes(term) ||
        opp.location.toLowerCase().includes(term);
      const matchesCategory =
        !categoryFilter || opp.category === categoryFilter;
      const matchesCommitment =
        !commitmentFilter || opp.commitment === commitmentFilter;
      const matchesDate =
        !dateFilter ||
        (opp.eventDate && opp.eventDate.toISOString().slice(0, 10) === dateFilter);

      const matchesDuration =
        !minimumHours || opp.hours >= Number.parseInt(minimumHours, 10);

      const matchesBadge =
        !badgeFilter || opp.badges.includes(badgeFilter);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCommitment &&
        matchesDate &&
        matchesDuration &&
        matchesBadge
      );
    });
  }, [
    opportunities,
    search,
    categoryFilter,
    commitmentFilter,
    dateFilter,
    minimumHours,
    badgeFilter,
  ]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-sky-100 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, organization, or location"
            className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by date"
            className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <input
            type="number"
            min="1"
            value={minimumHours}
            onChange={(e) => setMinimumHours(e.target.value)}
            placeholder="Minimum hours"
            aria-label="Filter by minimum duration"
            className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">All categories</option>
            {VOLUNTEER_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
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
        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          className="w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:w-44"
        >
          <option value="">All badges</option>
          {BADGES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-white/70 p-10 text-center text-slate-600 shadow-sm">
          No opportunities match your filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((opp) => (
            <Link
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="cursor-pointer rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-900">
                  {opp.category}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {opp.commitment}
                </span>
              </div>
              {opp.badges.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {opp.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
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
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">
                  View details
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
