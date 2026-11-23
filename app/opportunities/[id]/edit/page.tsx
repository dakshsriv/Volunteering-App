import { notFound } from "next/navigation";
import { OpportunityForm } from "@/components/OpportunityForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunityId = Number.parseInt(id, 10);

  if (!prisma || Number.isNaN(opportunityId)) notFound();

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) notFound();

  return (
    <div className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-3xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Edit opportunity
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {opportunity.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Anyone can edit a listing. Changes go live immediately and your name is
            recorded as the last editor.
          </p>
        </header>

        <OpportunityForm
          opportunityId={opportunity.id}
          initial={{
            title: opportunity.title,
            organization: opportunity.organization,
            description: opportunity.description,
            requirements: opportunity.requirements,
            location: opportunity.location,
            category: opportunity.category,
            commitment: opportunity.commitment,
            hours: opportunity.hours,
            link: opportunity.link,
            imageLinks: Array.isArray(opportunity.imageLinks)
              ? opportunity.imageLinks
              : [],
            badges: opportunity.badges,
          }}
        />
      </main>
    </div>
  );
}
