import type { Opportunity } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { ApplyLink } from "@/components/ApplyLink";
import { DEMO_OPPORTUNITIES } from "@/lib/demoOpportunities";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatEventDate(eventDate: Date | null) {
  if (!eventDate) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(eventDate);
}

async function getOpportunity(id: number): Promise<Opportunity | undefined> {
  if (prisma) {
    try {
      const opportunity = await prisma.opportunity.findFirst({
        where: { id, status: "approved" },
      });

      if (opportunity) return opportunity;
    } catch {
      // Use demo data when the database is unavailable.
    }
  }

  return DEMO_OPPORTUNITIES.find((opportunity) => opportunity.id === id);
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunityId = Number.parseInt(id, 10);
  const opportunity = Number.isNaN(opportunityId)
    ? undefined
    : await getOpportunity(opportunityId);

  if (!opportunity) notFound();

  return (
    <div className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-5xl space-y-8">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          <FiArrowLeft />
          All opportunities
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <article className="rounded-3xl border border-sky-100 bg-white/85 p-6 shadow-sm sm:p-10">
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              {opportunity.category}
            </span>
            {opportunity.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {opportunity.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              {opportunity.title}
            </h1>
            <p className="mt-2 text-lg font-medium text-sky-700">
              {opportunity.organization}
            </p>

            <div className="mt-8 space-y-7">
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  About the opportunity
                </h2>
                <p className="mt-2 leading-8 text-slate-700">
                  {opportunity.description}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Skills and qualifications
                </h2>
                <p className="mt-2 leading-8 text-slate-700">
                  {opportunity.requirements}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </h2>
                <p className="mt-2 leading-8 text-slate-700">
                  {opportunity.contactInfo ??
                    `Contact ${opportunity.organization} through the application link for role-specific questions and onboarding details.`}
                </p>
              </section>
            </div>

            <ApplyLink
              opportunityId={opportunity.id}
              href={opportunity.link}
              className="mt-8 inline-flex rounded-full bg-sky-600 px-6 py-3 text-center font-medium text-white transition hover:bg-sky-700"
            >
              Apply externally
            </ApplyLink>
          </article>

          <aside className="h-fit rounded-3xl border border-sky-200 bg-sky-50/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Details</h2>
            <dl className="mt-5 space-y-5">
              <div className="flex gap-3">
                <FiCalendar className="mt-1 shrink-0 text-sky-700" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date and time
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-700">
                    {formatEventDate(opportunity.eventDate)}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <FiClock className="mt-1 shrink-0 text-sky-700" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Duration
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {opportunity.hours} hours
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <FiMapPin className="mt-1 shrink-0 text-sky-700" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-700">
                    {opportunity.location}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Commitment
                </dt>
                <dd className="mt-1 text-sm text-slate-700">
                  {opportunity.commitment}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
    </div>
  );
}