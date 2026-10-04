import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isKeyValid } from "@/lib/security";

export async function GET(request: Request) {
  if (!isKeyValid(request.headers.get("x-admin-key") ?? "", process.env.ADMIN_KEY)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const items = await prisma.opportunity.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}