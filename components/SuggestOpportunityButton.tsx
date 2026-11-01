import Link from "next/link";

export function SuggestOpportunityButton() {
  return (
    <Link
      href="/opportunities/submit"
      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
    >
      Suggest Opportunity
    </Link>
  );
}
