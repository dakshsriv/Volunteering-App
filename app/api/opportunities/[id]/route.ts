import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseOpportunityInput, parsePersonName } from "@/lib/opportunityInput";
import { isFlagBadge } from "@/lib/opportunityOptions";
import { getClientIp, hashIp, rateLimit } from "@/lib/security";

const EDIT_LIMIT_PER_IP = 10;
const WINDOW_MS = 60_000;

export async function PATCH(
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
  if (!rateLimit(`edit:${ipHash}`, EDIT_LIMIT_PER_IP, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const editorName = parsePersonName(body.editorName);
  if (!editorName) {
    return NextResponse.json(
      { error: "editorName is required (max 120 characters)" },
      { status: 400 }
    );
  }

  const parsed = parseOpportunityInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const existing = await prisma.opportunity.findUnique({
      where: { id },
      select: { badges: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const { contactInfo, eventDate, badges, ...fields } = parsed.data;

    // Flags are managed through /flag, so an edit never drops or adds them.
    const flags = existing.badges.filter(isFlagBadge);

    const updated = await prisma.opportunity.update({
      where: { id },
      data: {
        ...fields,
        badges: [...badges, ...flags],
        ...(contactInfo !== undefined && { contactInfo }),
        ...(eventDate !== undefined && { eventDate }),
        lastEditedBy: editorName,
        lastEditedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database write failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
  if (!rateLimit(`delete:${ipHash}`, EDIT_LIMIT_PER_IP, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.opportunity.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    // ApplyEvent has a non-cascading foreign key, so its rows must go first.
    await prisma.$transaction([
      prisma.applyEvent.deleteMany({ where: { opportunityId: id } }),
      prisma.opportunity.delete({ where: { id } }),
    ]);

    return NextResponse.json({ deleted: id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database write failed" },
      { status: 500 }
    );
  }
}
