import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, hashIp, rateLimit } from "@/lib/security";

const APPLY_LIMIT_PER_USER = 3;
const APPLY_LIMIT_PER_IP = 20;
const WINDOW_MS = 60_000;

async function logBlocked(anonymousId: string | null, ipHash: string, reason: string) {
  if (!prisma) return;

  try {
    await prisma.blockedAttempt.create({
      data: { anonymousId, ipHash, reason },
    });
  } catch {
    // Logging a rejection must never break the request.
  }
}

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const opportunityId = Number(body.opportunityId);
  const anonymousId =
    typeof body.anonymousId === "string" ? body.anonymousId.trim() : "";
  const requestId =
    typeof body.requestId === "string" && body.requestId
      ? body.requestId
      : randomUUID();

  if (
    !Number.isInteger(opportunityId) ||
    opportunityId <= 0 ||
    anonymousId.length < 8
  ) {
    return NextResponse.json(
      { error: "Valid opportunityId and anonymousId are required" },
      { status: 400 }
    );
  }

  const ipHash = hashIp(getClientIp(request));

  if (
    !rateLimit(`apply:user:${anonymousId}`, APPLY_LIMIT_PER_USER, WINDOW_MS) ||
    !rateLimit(`apply:ip:${ipHash}`, APPLY_LIMIT_PER_IP, WINDOW_MS)
  ) {
    await logBlocked(anonymousId, ipHash, "rate_limit");
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true, status: true },
  });

  if (!opportunity || opportunity.status !== "approved") {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }

  try {
    await prisma.applyEvent.create({
      data: {
        opportunityId,
        anonymousId,
        requestId,
        ipHash,
        userAgent: request.headers.get("user-agent") ?? "",
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      await logBlocked(anonymousId, ipHash, "duplicate");
      return NextResponse.json({ ok: true, duplicate: true });
    }
    throw error;
  }

  return NextResponse.json({ ok: true });
}