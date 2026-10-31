"use client";

import { useState } from "react";
import {
  BADGES,
  COMMITMENT_TYPES,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";

export default function SubmitOpportunityPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const badges = BADGES.filter(
      (b) => b !== "Popular" && formData.get(`badge-${b}`) === "on"
    );

    const body = {
      title: String(formData.get("title")).trim(),
      organization: String(formData.get("organization")).trim(),
      description: String(formData.get("description")).trim(),
      requirements: String(formData.get("requirements")).trim(),
      location: String(formData.get("location")).trim(),
      category: String(formData.get("category")),
      commitment: String(formData.get("commitment")),
      hours: Number(formData.get("hours")),
      link: String(formData.get("link")).trim(),
      badges,
    };

    try {
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({ error: "Submit failed" }));

      if (!response.ok) {
        setError(data.error ?? "Submit failed");
        setStatus("error");
        return;
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-3xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Submit an opportunity
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Share a way to give back
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Submit a volunteering opportunity for review. Approved listings appear on the
            public directory.
          </p>
        </header>

        {status === "success" ? (
          <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-green-900">Submitted for review</h2>
            <p className="mt-2 text-green-800">
              A club mentor will review it before it goes live.
            </p>
            <a
              href="/opportunities"
              className="mt-6 inline-block rounded-full bg-sky-600 px-6 py-3 font-medium text-white transition hover:bg-sky-700"
            >
              Back to opportunities
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={120}
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="organization" className="block text-sm font-medium text-slate-700">
                  Organization <span className="text-red-500">*</span>
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  required
                  maxLength={120}
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {VOLUNTEER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="commitment" className="block text-sm font-medium text-slate-700">
                  Commitment <span className="text-red-500">*</span>
                </label>
                <select
                  id="commitment"
                  name="commitment"
                  required
                  defaultValue=""
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="" disabled>
                    Select commitment
                  </option>
                  {COMMITMENT_TYPES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-slate-700">
                  Required hours <span className="text-red-500">*</span>
                </label>
                <input
                  id="hours"
                  name="hours"
                  type="number"
                  min={1}
                  max={1000}
                  required
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  maxLength={200}
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="link" className="block text-sm font-medium text-slate-700">
                  Official sign-up link <span className="text-red-500">*</span>
                </label>
                <input
                  id="link"
                  name="link"
                  type="url"
                  required
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  maxLength={1000}
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="requirements" className="block text-sm font-medium text-slate-700">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={3}
                  maxLength={1000}
                  className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="sm:col-span-2">
                <span className="block text-sm font-medium text-slate-700">Badges</span>
                <div className="mt-3 flex flex-wrap gap-4">
                  {BADGES.filter((b) => b !== "Popular").map((badge) => (
                    <label
                      key={badge}
                      className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        name={`badge-${badge}`}
                        className="h-4 w-4 accent-sky-600"
                      />
                      {badge}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {status === "error" && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-sky-600 px-6 py-3 font-medium text-white transition hover:bg-sky-700 disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : "Submit for review"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
