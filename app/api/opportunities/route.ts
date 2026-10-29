import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  COMMITMENT_TYPES,
  UNSPECIFIED_LOCATION_LABEL,
  VOLUNTEER_CATEGORIES,
} from "@/lib/opportunityOptions";

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

  const body = await request.json();

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const organization =
    typeof body.organization === "string" ? body.organization.trim() : "";
  const contactInfo =
    typeof body.contactInfo === "string" ? body.contactInfo.trim() : null;
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const requirements =
    typeof body.requirements === "string" ? body.requirements.trim() : "";
  const location =
    typeof body.location === "string" && body.location.trim()
      ? body.location.trim()
      : UNSPECIFIED_LOCATION_LABEL;
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const commitment =
    typeof body.commitment === "string" ? body.commitment.trim() : "";
  const eventDate =
    typeof body.eventDate === "string" && body.eventDate.trim()
      ? new Date(body.eventDate)
      : null;
  const link = typeof body.link === "string" ? body.link.trim() : "";
  const hours =
    typeof body.hours === "number"
      ? body.hours
      : Number.parseInt(
          typeof body.hours === "string" ? body.hours : "",
          10
        );

  if (
    !title ||
    !organization ||
    !description ||
    !category ||
    !commitment ||
    !link ||
    Number.isNaN(hours) ||
    hours <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "title, organization, description, category, commitment, link, and a positive hours value are required",
      },
      { status: 400 }
    );
  }

  if (eventDate && Number.isNaN(eventDate.getTime())) {
    return NextResponse.json(
      { error: "eventDate must be a valid date and time" },
      { status: 400 }
    );
  }

  if (
    !VOLUNTEER_CATEGORIES.includes(
      category as (typeof VOLUNTEER_CATEGORIES)[number]
    )
  ) {
    return NextResponse.json(
      { error: "category must be one of the supported values" },
      { status: 400 }
    );
  }

  if (
    !COMMITMENT_TYPES.includes(
      commitment as (typeof COMMITMENT_TYPES)[number]
    )
  ) {
    return NextResponse.json(
      { error: "commitment must be one of the supported values" },
      { status: 400 }
    );
  }

  try {
    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        organization,
        contactInfo,
        description,
        requirements,
        location,
        category,
        commitment,
        eventDate,
        hours,
        link,
        status: "pending",
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