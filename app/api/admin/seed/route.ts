import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { seedOpportunities } from "@/lib/seed";

function isAuthorized(request: Request): boolean {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false;

  const provided = request.headers.get("x-admin-key");
  if (!provided) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await seedOpportunities();
  return NextResponse.json(result);
}