import { isFlagBadge } from "@/lib/opportunityOptions";

export function BadgePill({ badge }: { badge: string }) {
  const style = isFlagBadge(badge)
    ? "bg-red-100 text-red-800"
    : "bg-green-100 text-green-800";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>
      {badge}
    </span>
  );
}
