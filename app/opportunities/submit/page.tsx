import { OpportunityForm } from "@/components/OpportunityForm";

export default function SubmitOpportunityPage() {
  return (
    <div className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-3xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Submit an opportunity
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Share a way to give back
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Submit a volunteering opportunity. It is published to the public directory
            immediately, along with the name of the person who submitted it.
          </p>
        </header>

        <OpportunityForm />
      </main>
    </div>
  );
}
