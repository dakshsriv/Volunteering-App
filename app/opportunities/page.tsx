import type { Opportunity } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEMO_OPPORTUNITIES } from "@/lib/demoOpportunities";
import { seedOpportunities } from "@/lib/seed";
import { OpportunityList } from "@/components/OpportunityList";
import { SuggestOpportunityButton } from "@/components/SuggestOpportunityButton";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  let dbOpportunities: Opportunity[] = [];

  if (prisma) {
    try {
      const rows = await prisma.opportunity.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { applyEvents: true } } },
      });

      dbOpportunities = rows.map(({ _count, ...opp }) => ({
        ...opp,
        badges:
          _count.applyEvents >= 3
            ? [...opp.badges, "Popular"]
            : opp.badges,
      }));

      if (dbOpportunities.length === 0) {
        await seedOpportunities();
        const seeded = await prisma.opportunity.findMany({
          where: { status: "approved" },
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { applyEvents: true } } },
        });
        dbOpportunities = seeded.map(({ _count, ...opp }) => ({
          ...opp,
          badges:
            _count.applyEvents >= 3
              ? [...opp.badges, "Popular"]
              : opp.badges,
        }));
      }
    } catch {
      dbOpportunities = [];
    }
  }

  const opportunities =
    dbOpportunities.length > 0 ? dbOpportunities : DEMO_OPPORTUNITIES;

  return (
    <div className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
              Opportunities
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Find your next way to help
            </h1>
          </div>
          <SuggestOpportunityButton />
        </div>

        <OpportunityList opportunities={opportunities} />
      </main>
    </div>
  );
}
