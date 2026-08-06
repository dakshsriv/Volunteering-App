import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UNSPECIFIED_LOCATION_LABEL, VOLUNTEER_CATEGORIES } from "@/lib/opportunityOptions";

export async function GET() {
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(opportunities);
}

export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const link = typeof body.link === "string" ? body.link.trim() : "";
  const locationMode = body.locationMode;

  if (!title || !category || !link) {
    return NextResponse.json(
      { error: "title, category, and link are required" },
      { status: 400 }
    );
  }

  if (!VOLUNTEER_CATEGORIES.includes(category as (typeof VOLUNTEER_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: "category must be one of the supported values" },
      { status: 400 }
    );
  }

  const normalizedLocation =
    locationMode === "online"
      ? "Online"
      : locationMode === "unspecified"
        ? UNSPECIFIED_LOCATION_LABEL
        : body.location;

  const opportunity = await prisma.opportunity.create({
    data: {
      title,
      description: body.description,
      location: normalizedLocation,
      category,
      link,
    },
  });

  return NextResponse.json(opportunity, { status: 201 });
}
