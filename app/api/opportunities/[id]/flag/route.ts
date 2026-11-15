import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isFlagBadge } from "@/lib/opportunityOptions";
import { getClientIp, hashIp, rateLimit } from "@/lib/security";

const FLAG_LIMIT_PER_IP = 10;
const WINDOW_MS = 60_000;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const ipHash = hashIp(getClientIp(request));
  if (!rateLimit(`flag:${ipHash}`, FLAG_LIMIT_PER_IP, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const flag = body?.flag;
  const action = body?.action;

  if (!isFlagBadge(flag)) {
    return NextResponse.json(
      { error: "flag must be one of Closed, Spam, Report" },
      { status: 400 }
    );
  }

  if (action !== "add" && action !== "remove") {
    return NextResponse.json(
      { error: "action must be 'add' or 'remove'" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.opportunity.findUnique({
      where: { id },
      select: { badges: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const without = existing.badges.filter((b) => b !== flag);
    const badges = action === "add" ? [...without, flag] : without;

    const updated = await prisma.opportunity.update({
      where: { id },
      data: { badges },
      select: { id: true, badges: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database write failed" },
      { status: 500 }
    );
  }
}
