import {
  BADGES,
  COMMITMENT_TYPES,
  UNSPECIFIED_LOCATION_LABEL,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";

export interface OpportunityInput {
  title: string;
  organization: string;
  description: string;
  requirements: string;
  location: string;
  category: string;
  commitment: string;
  hours: number;
  link: string;
  imageLinks: string[];
  badges: string[];
  contactInfo?: string | null;
  eventDate?: Date | null;
}

type ParseResult =
  | { ok: true; data: OpportunityInput }
  | { ok: false; error: string };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeWebUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  let candidate = value.trim();
  if (!candidate) return null;

  if (candidate.startsWith("//")) {
    candidate = `https:${candidate}`;
  } else if (!/^[a-z][a-z0-9+.-]*:/i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (url.hostname.length === 0) return null;

    const cleaned = url.toString();
    return cleaned.length <= 2048 ? cleaned : null;
  } catch {
    return null;
  }
}

export function normalizeImageLinks(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const links: string[] = [];
  const seen = new Set<string>();

  for (const candidate of value) {
    const cleaned = normalizeWebUrl(candidate);
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    links.push(cleaned);
    if (links.length === 5) break;
  }

  return links;
}

export function parseOpportunityInput(body: Record<string, unknown>): ParseResult {
  const title = text(body.title);
  const organization = text(body.organization);
  const description = text(body.description);
  const requirements = text(body.requirements);
  const location = text(body.location) || UNSPECIFIED_LOCATION_LABEL;
  const category = text(body.category);
  const commitment = text(body.commitment);
  const link = normalizeWebUrl(body.link);
  const imageLinks = normalizeImageLinks(body.imageLinks);
  const hours =
    typeof body.hours === "number"
      ? body.hours
      : Number.parseInt(typeof body.hours === "string" ? body.hours : "", 10);

  const badges = Array.isArray(body.badges)
    ? body.badges.filter(
        (b: unknown): b is string =>
          typeof b === "string" &&
          BADGES.includes(b as (typeof BADGES)[number]) &&
          b !== "Popular"
      )
    : [];

  if (
    !title ||
    !organization ||
    !description ||
    !category ||
    !commitment ||
    !link ||
    Number.isNaN(hours) ||
    hours <= 0
  ) {
    return {
      ok: false,
      error:
        "title, organization, description, category, commitment, link, and a positive hours value are required",
    };
  }

  let contactInfo: string | null | undefined;
  if ("contactInfo" in body) contactInfo = text(body.contactInfo) || null;

  let eventDate: Date | null | undefined;
  if ("eventDate" in body) {
    const raw = text(body.eventDate);
    eventDate = raw ? new Date(raw) : null;
    if (eventDate && Number.isNaN(eventDate.getTime())) {
      return { ok: false, error: "eventDate must be a valid date and time" };
    }
  }

  if (!VOLUNTEER_CATEGORIES.includes(category as (typeof VOLUNTEER_CATEGORIES)[number])) {
    return { ok: false, error: "category must be one of the supported values" };
  }

  if (!COMMITMENT_TYPES.includes(commitment as (typeof COMMITMENT_TYPES)[number])) {
    return { ok: false, error: "commitment must be one of the supported values" };
  }

  return {
    ok: true,
    data: {
      title,
      organization,
      description,
      requirements,
      location,
      category,
      commitment,
      hours,
      link,
      imageLinks,
      badges,
      contactInfo,
      eventDate,
    },
  };
}

export function parsePersonName(value: unknown): string | null {
  const name = text(value);
  return name && name.length <= 120 ? name : null;
}
