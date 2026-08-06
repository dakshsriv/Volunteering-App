import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Opportunities() {
  let opportunities: Array<{
    id: number;
    title: string;
    description: string;
    location: string;
    category: string;
    link: string;
    createdAt: Date;
  }> = [];

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
      <main className="w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
              Opportunities
            </p>
            <div className="flex">
              <h1 className="text-3xl font-semibold text-slate-900">
                Find your next way to help
              </h1>
              <button type="button" className="ml-4 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700">
                <Link href="/opportunities/new">Suggest Opportunity</Link>
              </button>
            </div>
          
          </div>
          <p className="text-sm text-slate-600">
            {prisma ? "Connected to PostgreSQL through Prisma." : "Set DATABASE_URL to connect this page to PostgreSQL."}
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-sky-200 bg-white/70 p-10 text-center text-slate-600 shadow-sm">
            No opportunities yet. Add a record to your database to see it here.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                    {opportunity.category}
                  </span>
                  <p className="text-xs text-slate-500">
                    {new Date(opportunity.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">{opportunity.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{opportunity.description}</p>
                <p className="mt-4 text-sm font-medium text-sky-700">{opportunity.location}</p>
                <a
                  href={opportunity.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-800"
                >
                  Learn more
                </a>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}