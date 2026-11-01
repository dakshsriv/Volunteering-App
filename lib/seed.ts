import { prisma } from "./prisma";
import { DEMO_OPPORTUNITIES } from "./demoOpportunities";

export interface SeedResult {
  seeded: boolean;
  count: number;
  reason?: string;
}

export async function seedOpportunities(): Promise<SeedResult> {
  if (!prisma) {
    return { seeded: false, count: 0, reason: "DATABASE_URL not configured" };
  }

  let created = 0;

  for (const opp of DEMO_OPPORTUNITIES) {
    const existing = await prisma.opportunity.findFirst({
      where: {
        title: opp.title,
        organization: opp.organization,
      },
    });

    if (!existing) {
      await prisma.opportunity.create({
        data: {
          title: opp.title,
          organization: opp.organization,
          contactInfo: opp.contactInfo,
          description: opp.description,
          requirements: opp.requirements,
          location: opp.location,
          category: opp.category,
          commitment: opp.commitment,
          eventDate: opp.eventDate,
          hours: opp.hours,
          link: opp.link,
          badges: opp.badges,
          status: "approved",
        },
      });
      created++;
    }
  }

  return { seeded: created > 0, count: created };
}