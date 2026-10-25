"use client";

import { useSyncExternalStore, useState } from "react";
import {
  getStoredPreferences,
  parsePreferences,
  savePreferences,
  subscribeToPreferences,
  type CommitmentType,
  type OpportunityCategory,
} from "@/lib/clientPreferences";
import {
  COMMITMENT_TYPES,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";

export default function PreferencesPage() {
  const storedPreferences = useSyncExternalStore(
    subscribeToPreferences,
    getStoredPreferences,
    () => ""
  );
  const preferences = parsePreferences(storedPreferences);
  const [saved, setSaved] = useState(false);

  function toggleCategory(category: OpportunityCategory) {
    const nextPreferences = {
      ...preferences,
      categories: preferences.categories.includes(category)
        ? preferences.categories.filter((item) => item !== category)
        : [...preferences.categories, category],
    };
    savePreferences(nextPreferences);
    setSaved(false);
  }

  function toggleCommitment(commitment: CommitmentType) {
    const nextPreferences = {
      ...preferences,
      commitments: preferences.commitments.includes(commitment)
        ? preferences.commitments.filter((item) => item !== commitment)
        : [...preferences.commitments, commitment],
    };
    savePreferences(nextPreferences);
    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    savePreferences(preferences);
    setSaved(true);
  }

  return (
    <div className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-3xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Your preferences
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Shape what you see
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Choose the causes and schedules that feel right. Your choices stay
            on this device and help filter the opportunities list.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-[0_20px_60px_rgba(91,140,255,0.12)] sm:p-8"
        >
          <fieldset>
            <legend className="text-lg font-semibold text-slate-900">
              Causes you care about
            </legend>
            <p className="mt-1 text-sm text-slate-500">
              Leave these unselected to see every category.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {VOLUNTEER_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <input
                    type="checkbox"
                    checked={preferences.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 accent-sky-600"
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-semibold text-slate-900">
              Commitment style
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {COMMITMENT_TYPES.map((commitment) => (
                <label
                  key={commitment}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <input
                    type="checkbox"
                    checked={preferences.commitments.includes(commitment)}
                    onChange={() => toggleCommitment(commitment)}
                    className="h-4 w-4 accent-sky-600"
                  />
                  {commitment}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 border-t border-sky-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500" aria-live="polite">
              {saved ? "Preferences saved on this device." : ""}
            </p>
            <button
              type="submit"
              className="rounded-full bg-sky-600 px-6 py-3 font-medium text-white transition hover:bg-sky-700 hover:shadow-lg"
            >
              Save preferences
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}