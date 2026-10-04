import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isKeyValid } from "@/lib/security";

export async function POST(request: Request) {
  if (!isKeyValid(request.headers.get("x-admin-key") ?? "", process.env.ADMIN_KEY)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const id = Number(body.id);
  const action = body.action;

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
  }

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json(
      { error: "action must be 'approve' or 'reject'" },
      { status: 400 }
    );
  }

  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      status: action === "approve" ? "approved" : "rejected",
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json(opportunity);
}