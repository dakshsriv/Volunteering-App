"use client";

import { useState } from "react";

interface PassphraseDialogProps {
  title: string;
  confirmLabel: string;
  destructive?: boolean;
  error?: string;
  busy?: boolean;
  onConfirm: (passphrase: string) => void;
  onCancel: () => void;
}

export function PassphraseDialog({
  title,
  confirmLabel,
  destructive = false,
  error,
  busy = false,
  onConfirm,
  onCancel,
}: PassphraseDialogProps) {
  const [passphrase, setPassphrase] = useState("");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="passphrase-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm(passphrase.trim());
        }}
        className="w-full max-w-sm space-y-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-xl"
      >
        <h2
          id="passphrase-dialog-title"
          className="text-lg font-semibold text-slate-900"
        >
          {title}
        </h2>
        <div>
          <label
            htmlFor="dialog-passphrase"
            className="block text-sm font-medium text-slate-700"
          >
            School passphrase
          </label>
          <input
            id="dialog-passphrase"
            type="password"
            required
            autoFocus
            autoComplete="off"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            className="mt-1 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className={`rounded-full px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60 ${
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
