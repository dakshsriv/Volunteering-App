import {
  COMMITMENT_TYPES,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";

export const ANONYMOUS_ID_KEY = "volunteer-anonymous-id";
export const PREFERENCES_KEY = "volunteer-preferences";

export type OpportunityCategory = (typeof VOLUNTEER_CATEGORIES)[number];
export type CommitmentType = (typeof COMMITMENT_TYPES)[number];

export interface UserPreferences {
  categories: OpportunityCategory[];
  commitments: CommitmentType[];
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  categories: [],
  commitments: [],
};

function isCategory(value: string): value is OpportunityCategory {
  return VOLUNTEER_CATEGORIES.includes(value as OpportunityCategory);
}

function isCommitment(value: string): value is CommitmentType {
  return COMMITMENT_TYPES.includes(value as CommitmentType);
}

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
    if (existing && existing.length >= 8) return existing;

    const id = window.crypto.randomUUID();
    window.localStorage.setItem(ANONYMOUS_ID_KEY, id);
    return id;
  } catch {
    return window.crypto.randomUUID();
  }
}

export function readPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  return parsePreferences(window.localStorage.getItem(PREFERENCES_KEY));
}

export function parsePreferences(stored: string | null): UserPreferences {
  if (!stored) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(stored) as Partial<UserPreferences>;
    return {
      categories: Array.isArray(parsed.categories)
        ? parsed.categories.filter(
            (value): value is OpportunityCategory =>
              typeof value === "string" && isCategory(value)
          )
        : [],
      commitments: Array.isArray(parsed.commitments)
        ? parsed.commitments.filter(
            (value): value is CommitmentType =>
              typeof value === "string" && isCommitment(value)
          )
        : [],
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: UserPreferences): void {
  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new Event("volunteer-preferences-changed"));
}

export function getStoredPreferences(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PREFERENCES_KEY) ?? "";
}

export function subscribeToPreferences(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("volunteer-preferences-changed", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("volunteer-preferences-changed", onStoreChange);
  };
}