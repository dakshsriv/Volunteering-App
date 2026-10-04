import Parser from "rss-parser";
import type {
  IntakeOpportunity,
  IntakeSourceAdapter,
  SourceConfig,
} from "./types";

const parser = new Parser();

export class RssSourceAdapter implements IntakeSourceAdapter {
  constructor(private readonly source: SourceConfig) {}

  get id(): string {
    return this.source.id;
  }

  async fetch(): Promise<IntakeOpportunity[]> {
    const feed = await parser.parseURL(this.source.baseUrl);

    return feed.items.slice(0, this.source.maxItems).map((item) => ({
      title: item.title?.trim() ?? "",
      organization: this.source.organization,
      category: this.source.category,
      commitment: this.source.defaultCommitment,
      hours: this.source.defaultHours,
      description: item.contentSnippet?.trim() || item.content?.trim() || "",
      requirements: "See listing for full details.",
      location: this.source.location,
      link: item.link?.trim() ?? "",
      sourceUrl: item.link?.trim() ?? this.source.baseUrl,
    }));
  }
}