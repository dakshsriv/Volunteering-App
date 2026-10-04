import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  try {
    const [activeUsers, applyEvents, blockedAttempts] = await Promise.all([
      prisma.applyEvent
        .groupBy({ by: ["anonymousId"] })
        .then((groups) => groups.length),
      prisma.applyEvent.count(),
      prisma.blockedAttempt.count(),
    ]);

    return NextResponse.json({
      activeUsers,
      applyEvents,
      blockedAttempts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Metrics query failed" },
      { status: 500 }
    );
  }
}