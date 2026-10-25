import type { Opportunity } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEMO_OPPORTUNITIES } from "@/lib/demoOpportunities";
import { seedOpportunities } from "@/lib/seed";
import { HoursCalculator } from "@/components/HoursCalculator";
import { RecommendedOpportunities } from "@/components/RecommendedOpportunities";

export const dynamic = "force-dynamic";

export default async function Home() {
  let dbOpportunities: Opportunity[] = [];

  if (prisma) {
    try {
      dbOpportunities = await prisma.opportunity.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
      });

      if (dbOpportunities.length === 0) {
        await seedOpportunities();
        dbOpportunities = await prisma.opportunity.findMany({
          where: { status: "approved" },
          orderBy: { createdAt: "desc" },
        });
      }
    } catch {
      dbOpportunities = [];
    }
  }

  const opportunities =
    dbOpportunities.length > 0 ? dbOpportunities : DEMO_OPPORTUNITIES;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-6xl space-y-8">
        <section className="rounded-4xl border border-sky-100 bg-white/80 p-8 shadow-[0_20px_60px_rgba(91,140,255,0.14)] backdrop-blur transition-all duration-300 hover:shadow-[0_25px_70px_rgba(91,140,255,0.18)] sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 transition-colors duration-200 hover:bg-sky-200">
                Community impact starts here
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Discover meaningful ways to give back.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  A modern volunteering hub for finding local opportunities, joining inspiring causes, and making a real difference.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/opportunities"
                  className="rounded-full bg-sky-600 px-6 py-3 text-center font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-sky-700 hover:shadow-lg"
                >
                  Explore Opportunities
                </a>
                <a
                  href="#benefits"
                  className="rounded-full border border-sky-200 bg-sky-50 px-6 py-3 text-center font-medium text-sky-700 transition-all duration-200 hover:scale-105 hover:bg-sky-100 hover:shadow-md"
                >
                  Why it matters
                </a>
              </div>
            </div>

            <HoursCalculator />
          </div>
        </section>

        <RecommendedOpportunities opportunities={opportunities} />

        <section id="benefits" className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Easy to browse",
              text: "Find opportunities that fit your schedule, interests, and location.",
            },
            {
              title: "Built for connection",
              text: "Meet local organizers and join movements that feel personal and meaningful.",
            },
            {
              title: "Meaningful impact",
              text: "Turn small acts of service into lasting changes for your community.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-sky-100 bg-white/70 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white/90 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
