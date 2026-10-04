export interface IntakeOpportunity {
  title: string;
  organization: string;
  category: string;
  commitment: string;
  hours: number;
  description: string;
  requirements: string;
  location: string;
  link: string;
  sourceUrl: string;
}

export interface IntakeSourceAdapter {
  id: string;
  fetch(): Promise<IntakeOpportunity[]>;
}

export interface SourceConfig {
  id: string;
  name: string;
  baseUrl: string;
  type: "rss" | "json";
  consentStatus: "ok" | "denied" | "unknown";
  enabled: boolean;
  organization: string;
  category: string;
  location: string;
  defaultHours: number;
  defaultCommitment: string;
  maxItems: number;
}