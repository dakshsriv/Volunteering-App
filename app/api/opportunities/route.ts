import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseOpportunityInput, parsePersonName } from "@/lib/opportunityInput";
import { getClientIp, hashIp, rateLimit } from "@/lib/security";
import { checkWritePassphrase } from "@/lib/writeAccess";

const WRITE_LIMIT_PER_IP = 10;
const WINDOW_MS = 60_000;

export async function GET() {
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  try {
    const opportunities = await prisma.opportunity.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(opportunities);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database query failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const ipHash = hashIp(getClientIp(request));
  if (!rateLimit(`create:${ipHash}`, WRITE_LIMIT_PER_IP, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const denied = checkWritePassphrase(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const submitterName = parsePersonName(body.submitterName);
  if (!submitterName) {
    return NextResponse.json(
      { error: "submitterName is required (max 120 characters)" },
      { status: 400 }
    );
  }

  const parsed = parseOpportunityInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { contactInfo, eventDate, ...fields } = parsed.data;

  try {
    const opportunity = await prisma.opportunity.create({
      data: {
        ...fields,
        submitterName,
        contactInfo: contactInfo ?? null,
        eventDate: eventDate ?? null,
        status: "approved",
      },
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database write failed" },
      { status: 500 }
    );
  }
}
