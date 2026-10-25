"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Opportunity } from "@prisma/client";
import {
  getStoredPreferences,
  parsePreferences,
  subscribeToPreferences,
  type CommitmentType,
  type OpportunityCategory,
} from "@/lib/clientPreferences";
import { ApplyLink } from "./ApplyLink";
import { OpportunityModal } from "./OpportunityModal";

interface RecommendedOpportunitiesProps {
  opportunities: Opportunity[];
}

export function RecommendedOpportunities({
  opportunities,
}: RecommendedOpportunitiesProps) {
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const storedPreferences = useSyncExternalStore(
    subscribeToPreferences,
    getStoredPreferences,
    () => ""
  );
  const preferences = parsePreferences(storedPreferences);

  const recommendations = useMemo(() => {
    return [...opportunities]
      .sort((first, second) => {
        const firstScore =
          (preferences.categories.includes(
            first.category as OpportunityCategory
          )
            ? 3
            : 0) +
          (preferences.commitments.includes(first.commitment as CommitmentType)
            ? 2
            : 0);
        const secondScore =
          (preferences.categories.includes(
            second.category as OpportunityCategory
          )
            ? 3
            : 0) +
          (preferences.commitments.includes(
            second.commitment as CommitmentType
          )
            ? 2
            : 0);

        return secondScore - firstScore;
      })
      .slice(0, 5);
  }, [opportunities, preferences]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Recommended for you
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Five ways to make an impact
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Your selected causes and commitment style guide this shortlist.
          </p>
        </div>
        <a
          href="/preferences"
          className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          Tune preferences
        </a>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {recommendations.map((opportunity) => (
          <article
            key={opportunity.id}
            onClick={() => setSelected(opportunity)}
            className="cursor-pointer rounded-3xl border border-sky-100 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
              {opportunity.category}
            </span>
            <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-slate-900">
              {opportunity.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-sky-700">
              {opportunity.organization}
            </p>
            <div className="mt-5 flex items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-slate-800">
                {opportunity.hours} hours
              </span>
              <ApplyLink
                opportunityId={opportunity.id}
                href={opportunity.link}
                onClick={(event) => event.stopPropagation()}
                className="rounded-full bg-sky-600 px-3 py-2 font-medium text-white transition hover:bg-sky-700"
              >
                Apply
              </ApplyLink>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <OpportunityModal
          opportunity={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}