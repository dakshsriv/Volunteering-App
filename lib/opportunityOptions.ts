export const VOLUNTEER_CATEGORIES = [
  "STEM",
  "Tutoring",
  "Environment",
  "Community",
  "Sports",
  "Arts & Tech",
  "Healthcare Support",
  "Animal Welfare",
  "Other",
] as const;

export const COMMITMENT_TYPES = [
  "One-Time",
  "Weekly",
  "Flexible",
] as const;

export const BADGES = ["Eco-Friendly", "Popular"] as const;

export const UNSPECIFIED_LOCATION_LABEL = "Unspecified";

export const FLAG_BADGES = ["Closed", "Spam", "Report"] as const;

export type FlagBadge = (typeof FLAG_BADGES)[number];

export const FLAG_DESCRIPTIONS: Record<FlagBadge, string> = {
  Closed: "No longer accepting volunteers",
  Spam: "Spam or not a real opportunity",
  Report: "Safety concern",
};

export function isFlagBadge(value: unknown): value is FlagBadge {
  return FLAG_BADGES.includes(value as FlagBadge);
}

export function formatEditedLabel(
  editedAt: Date | null,
  editedBy: string | null
): string | null {
  if (!editedAt) return null;

  const date = new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(
    editedAt
  );
  return editedBy ? `Edited ${date} by ${editedBy}` : `Edited ${date}`;
}
