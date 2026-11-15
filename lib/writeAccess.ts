import { NextResponse } from "next/server";
import { isKeyValid } from "@/lib/security";

export const PASSPHRASE_HEADER = "x-passphrase";

// WRITE_PASSPHRASE accepts a comma-separated list so each school can have its own
// code and a single code can be revoked without affecting the others.
function getAllowedPassphrases(): string[] {
  return (process.env.WRITE_PASSPHRASE ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function checkWritePassphrase(request: Request): NextResponse | null {
  const allowed = getAllowedPassphrases();

  if (allowed.length === 0) {
    return NextResponse.json(
      { error: "Writes are disabled: WRITE_PASSPHRASE is not configured" },
      { status: 503 }
    );
  }

  const provided = request.headers.get(PASSPHRASE_HEADER) ?? "";
  const valid = allowed.some((expected) => isKeyValid(provided, expected));

  if (!valid) {
    return NextResponse.json({ error: "Incorrect passphrase" }, { status: 401 });
  }

  return null;
}
