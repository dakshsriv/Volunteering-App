"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PassphraseDialog } from "./PassphraseDialog";
import {
  FLAG_BADGES,
  FLAG_DESCRIPTIONS,
  type FlagBadge,
} from "@/lib/opportunityOptions";

interface FlagControlsProps {
  opportunityId: number;
  badges: string[];
}

export function FlagControls({ opportunityId, badges }: FlagControlsProps) {
  const router = useRouter();
  const [target, setTarget] = useState<{
    flag: FlagBadge;
    action: "add" | "remove";
  } | null>(null);
  const [pending, setPending] = useState<FlagBadge | null>(null);
  const [error, setError] = useState("");

  async function update(passphrase: string) {
    if (!target) return;
    const { flag, action } = target;
    setPending(flag);
    setError("");

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-passphrase": passphrase },
        body: JSON.stringify({ flag, action }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not update this listing");
        return;
      }

      setTarget(null);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="mt-8 border-t border-sky-100 pt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Something wrong with this listing?
      </h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {FLAG_BADGES.map((flag) => {
          const active = badges.includes(flag);
          return (
            <button
              key={flag}
              type="button"
              disabled={pending !== null}
              onClick={() => {
                setError("");
                setTarget({ flag, action: active ? "remove" : "add" });
              }}
              title={FLAG_DESCRIPTIONS[flag]}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              {active ? `Remove "${flag}"` : `Mark as ${flag}`}
            </button>
          );
        })}
      </div>
      {target && (
        <PassphraseDialog
          title={
            target.action === "add"
              ? `Mark this listing as ${target.flag}?`
              : `Remove the "${target.flag}" flag?`
          }
          confirmLabel="Confirm"
          busy={pending !== null}
          error={error}
          onConfirm={update}
          onCancel={() => setTarget(null)}
        />
      )}
    </section>
  );
}
