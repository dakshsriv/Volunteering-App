import type { SourceConfig } from "./types";

export const SOURCES: SourceConfig[] = [
  {
    id: "example-community-feed",
    name: "Example Community Volunteer Feed",
    baseUrl: "https://example.com/volunteer-feed.xml",
    type: "rss",
    consentStatus: "ok",
    enabled: false, // enable only once a real, consent-approved feed is configured
    organization: "Example Community Org",
    category: "Community",
    location: "Oakville, ON",
    defaultHours: 2,
    defaultCommitment: "One-Time",
    maxItems: 20,
  },
];