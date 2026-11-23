"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BADGES,
  COMMITMENT_TYPES,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";

export interface OpportunityFormValues {
  title: string;
  organization: string;
  description: string;
  requirements: string;
  location: string;
  category: string;
  commitment: string;
  hours: number | "";
  link: string;
  imageLinks: string[];
  badges: string[];
}

const EMPTY_VALUES: OpportunityFormValues = {
  title: "",
  organization: "",
  description: "",
  requirements: "",
  location: "",
  category: "",
  commitment: "",
  hours: "",
  link: "",
  imageLinks: [],
  badges: [],
};

interface OpportunityFormProps {
  opportunityId?: number;
  initial?: OpportunityFormValues;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

const labelClass = "block text-sm font-medium text-slate-700";

function Required() {
  return <span className="text-red-500">*</span>;
}

export function OpportunityForm({ opportunityId, initial }: OpportunityFormProps) {
  const router = useRouter();
  const isEdit = opportunityId !== undefined;
  const values = initial ?? EMPTY_VALUES;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [imageLinks, setImageLinks] = useState<string[]>(
    (Array.isArray(values.imageLinks) ? values.imageLinks : []).slice(0, 5)
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const badges = BADGES.filter(
      (b) => b !== "Popular" && formData.get(`badge-${b}`) === "on"
    );

    const body = {
      [isEdit ? "editorName" : "submitterName"]: String(formData.get("personName")).trim(),
      title: String(formData.get("title")).trim(),
      organization: String(formData.get("organization")).trim(),
      description: String(formData.get("description")).trim(),
      requirements: String(formData.get("requirements")).trim(),
      location: String(formData.get("location")).trim(),
      category: String(formData.get("category")),
      commitment: String(formData.get("commitment")),
      hours: Number(formData.get("hours")),
      link: String(formData.get("link")).trim(),
      imageLinks: imageLinks.map((link) => link.trim()).filter(Boolean),
      badges,
    };

    try {
      const response = await fetch(
        isEdit ? `/api/opportunities/${opportunityId}` : "/api/opportunities",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-passphrase": String(formData.get("passphrase")).trim(),
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json().catch(() => ({ error: "Submit failed" }));

      if (!response.ok) {
        setError(data.error ?? "Submit failed");
        setStatus("error");
        return;
      }

      if (isEdit) {
        router.push(`/opportunities/${opportunityId}`);
        router.refresh();
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-green-900">Opportunity published</h2>
        <p className="mt-2 text-green-800">Your opportunity is now live on the directory.</p>
        <Link
          href="/opportunities"
          className="mt-6 inline-block rounded-full bg-sky-600 px-6 py-3 font-medium text-white transition hover:bg-sky-700"
        >
          Back to opportunities
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="personName" className={labelClass}>
            Your name <Required />
          </label>
          <input id="personName" name="personName" type="text" required maxLength={120} className={inputClass} />
          {isEdit && (
            <p className="mt-1 text-xs text-slate-500">
              Shown as the last editor of this listing.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="passphrase" className={labelClass}>
            School passphrase <Required />
          </label>
          <input id="passphrase" name="passphrase" type="password" required autoComplete="off" className={inputClass} />
          <p className="mt-1 text-xs text-slate-500">
            Ask your school for the passphrase. It keeps spam out.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Title <Required />
          </label>
          <input id="title" name="title" type="text" required maxLength={120} defaultValue={values.title} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="organization" className={labelClass}>
            Organization <Required />
          </label>
          <input id="organization" name="organization" type="text" required maxLength={120} defaultValue={values.organization} className={inputClass} />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category <Required />
          </label>
          <select id="category" name="category" required defaultValue={values.category} className={inputClass}>
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
          <label htmlFor="commitment" className={labelClass}>
            Commitment <Required />
          </label>
          <select id="commitment" name="commitment" required defaultValue={values.commitment} className={inputClass}>
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
          <label htmlFor="hours" className={labelClass}>
            Required hours <Required />
          </label>
          <input id="hours" name="hours" type="number" min={1} max={1000} required defaultValue={values.hours} className={inputClass} />
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            Location <Required />
          </label>
          <input id="location" name="location" type="text" required maxLength={200} defaultValue={values.location} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="link" className={labelClass}>
            Official sign-up link <Required />
          </label>
          <input id="link" name="link" type="url" required placeholder="https://..." defaultValue={values.link} className={inputClass} />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>Image links <span className="font-normal text-slate-500">(optional, up to 5)</span></legend>
          <div className="mt-2 space-y-3">
            {imageLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  id={`imageLink-${index}`}
                  name={`imageLink-${index}`}
                  type="url"
                  maxLength={2048}
                  placeholder={`https://.../image-${index + 1}.jpg`}
                  value={link}
                  onChange={(event) =>
                    setImageLinks((current) =>
                      current.map((currentLink, currentIndex) =>
                        currentIndex === index ? event.target.value : currentLink
                      )
                    )
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageLinks((current) =>
                      current.filter((_, currentIndex) => currentIndex !== index)
                    )
                  }
                  className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xl font-semibold text-red-700 transition hover:bg-red-100"
                  aria-label={`Remove image link ${index + 1}`}
                  title="Remove image"
                >
                  -
                </button>
              </div>
            ))}
            {imageLinks.length < 5 && (
              <button
                type="button"
                onClick={() =>
                  setImageLinks((current) => [...current, ""])
                }
                className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-xl font-semibold text-sky-700 transition hover:bg-sky-100"
                aria-label="Add another image link"
                title="Add image"
              >
                +
              </button>
            )}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description <Required />
          </label>
          <textarea id="description" name="description" required rows={4} maxLength={1000} defaultValue={values.description} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="requirements" className={labelClass}>
            Requirements
          </label>
          <textarea id="requirements" name="requirements" rows={3} maxLength={1000} defaultValue={values.requirements} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <span className={labelClass}>Badges</span>
          <div className="mt-3 flex flex-wrap gap-4">
            {BADGES.filter((b) => b !== "Popular").map((badge) => (
              <label
                key={badge}
                className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  name={`badge-${badge}`}
                  defaultChecked={values.badges.includes(badge)}
                  className="h-4 w-4 accent-sky-600"
                />
                {badge}
              </label>
            ))}
          </div>
        </div>
      </div>

      {status === "error" && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="flex justify-end gap-3">
        {isEdit && (
          <Link
            href={`/opportunities/${opportunityId}`}
            className="rounded-full border border-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-sky-600 px-6 py-3 font-medium text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {status === "submitting"
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Publish opportunity"}
        </button>
      </div>
    </form>
  );
}
