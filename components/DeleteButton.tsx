"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PassphraseDialog } from "./PassphraseDialog";

export function DeleteButton({ opportunityId }: { opportunityId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(passphrase: string) {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: "DELETE",
        headers: { "x-passphrase": passphrase },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not delete this listing");
        setDeleting(false);
        return;
      }

      router.push("/opportunities");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        Delete listing
      </button>
      {open && (
        <PassphraseDialog
          title="Delete this listing permanently? This cannot be undone."
          confirmLabel="Delete"
          destructive
          busy={deleting}
          error={error}
          onConfirm={handleDelete}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
