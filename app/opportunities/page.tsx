import type { Opportunity } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { OpportunityList } from "@/components/OpportunityList";
import { SuggestOpportunityButton } from "@/components/SuggestOpportunityButton";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  let opportunities: Opportunity[] = [];
  const dbConnected = Boolean(prisma);

  if (prisma) {
    try {
      opportunities = await prisma.opportunity.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      opportunities = [];
    }
  }

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
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <SuggestOpportunityButton />
            <p className="text-sm text-slate-600">
              {dbConnected
                ? "Connected to PostgreSQL through Prisma."
                : "Set DATABASE_URL to connect this page to PostgreSQL."}
            </p>
          </div>
        </div>

        <OpportunityList opportunities={opportunities} dbConnected={dbConnected} />
      </main>
    </div>
  );
}
