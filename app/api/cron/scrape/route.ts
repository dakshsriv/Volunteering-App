import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isKeyValid } from "@/lib/security";
import { RssSourceAdapter } from "@/lib/intake/genericFeed";
import { SOURCES } from "@/lib/intake/sources";
import { VOLUNTEER_CATEGORIES, COMMITMENT_TYPES } from "@/lib/opportunityOptions";
import type { IntakeOpportunity, SourceConfig } from "@/lib/intake/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isValid(item: IntakeOpportunity): boolean {
  if (!item.title || !item.organization || !item.link) return false;

  try {
    const url = new URL(item.link);
    if (url.protocol !== "https:") return false;
  } catch {
    return false;
  }

  if (
    !VOLUNTEER_CATEGORIES.includes(
      item.category as (typeof VOLUNTEER_CATEGORIES)[number]
    )
  ) {
    return false;
  }

  if (
    !COMMITMENT_TYPES.includes(
      item.commitment as (typeof COMMITMENT_TYPES)[number]
    )
  ) {
    return false;
  }

  return Number.isInteger(item.hours) && item.hours > 0;
}

function createAdapter(source: SourceConfig) {
  if (source.type === "rss") return new RssSourceAdapter(source);
  throw new Error(`Unsupported source type: ${source.type}`);
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!isKeyValid(auth ?? "", process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const summary: Record<string, number> = {};
  const errors: string[] = [];

  for (const source of SOURCES) {
    if (!source.enabled || source.consentStatus !== "ok") continue;

    try {
      const adapter = createAdapter(source);
      const items = await adapter.fetch();
      let created = 0;

      for (const item of items) {
        if (!isValid(item)) continue;

        const existing = await prisma.opportunity.findFirst({
          where: { title: item.title, organization: item.organization },
          select: { id: true },
        });

        if (existing) continue;

        await prisma.opportunity.create({
          data: {
            title: item.title,
            organization: item.organization,
            description: item.description,
            requirements: item.requirements,
            location: item.location,
            category: item.category,
            commitment: item.commitment,
            hours: item.hours,
            link: item.link,
            status: "pending",
            sourceUrl: item.sourceUrl,
          },
        });
        created++;
      }

      summary[source.id] = created;
    } catch (error) {
      errors.push(
        `${source.id}: ${error instanceof Error ? error.message : "scrape failed"}`
      );
    }
  }

  return NextResponse.json({ ok: true, summary, errors });
}