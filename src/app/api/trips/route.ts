import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ActivityBrief, ActivityCategoryId } from "@/types";

const DEMO_USER = {
  id: "user_1",
  email: "demo@travelnegotiator.ai",
  name: "Demo User",
};

const ACTIVITY_CATEGORY_IDS = new Set<ActivityCategoryId>([
  "active",
  "relaxed",
  "social",
  "private_group",
  "solo_friendly",
  "food_nightlife",
  "culture_sights",
]);

function normalizeActivityBrief(value: unknown): { brief: ActivityBrief | null; error?: string } {
  if (value == null) return { brief: null };
  if (typeof value !== "object" || Array.isArray(value)) {
    return { brief: null, error: "Activity brief must be an object." };
  }

  const candidate = value as { categories?: unknown; request?: unknown; createdAt?: unknown };
  if (!Array.isArray(candidate.categories) || typeof candidate.request !== "string") {
    return { brief: null, error: "Activity brief must include categories and request." };
  }

  const categories: ActivityCategoryId[] = [];
  for (const category of candidate.categories) {
    if (typeof category !== "string" || !ACTIVITY_CATEGORY_IDS.has(category as ActivityCategoryId)) {
      return { brief: null, error: "Activity brief includes an unsupported category." };
    }
    if (!categories.includes(category as ActivityCategoryId)) {
      categories.push(category as ActivityCategoryId);
    }
  }

  const request = candidate.request.trim();
  if (categories.length === 0 && request.length === 0) return { brief: null };

  return {
    brief: {
      categories,
      request,
      createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : new Date().toISOString(),
    },
  };
}

export async function GET() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hotels: {
        include: {
          offers: true,
          negotiations: true,
        },
      },
      decision: true,
    },
  });
  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, cityCode, checkIn, checkOut, guests, rooms, budgetMin, budgetMax, currency, starRating, notes, activityBrief } = body;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const minBudget = Number(budgetMin ?? 0);
    const maxBudget = Number(budgetMax ?? 9999);
    const minimumStarRating = Number(starRating);
    const normalizedActivityBrief = normalizeActivityBrief(activityBrief);

    if (!destination || !cityCode || Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: "Missing required trip details." }, { status: 400 });
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
    }

    if (maxBudget <= minBudget) {
      return NextResponse.json({ error: "Maximum budget must be greater than minimum budget." }, { status: 400 });
    }

    if (normalizedActivityBrief.error) {
      return NextResponse.json({ error: normalizedActivityBrief.error }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { id: DEMO_USER.id },
      update: {},
      create: DEMO_USER,
    });

    const trip = await prisma.trip.create({
      data: {
        destination,
        cityCode,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guests ?? 1,
        rooms: rooms ?? 1,
        budgetMin: minBudget,
        budgetMax: maxBudget,
        currency: currency ?? "USD",
        starRating: Number.isFinite(minimumStarRating) && minimumStarRating > 0 ? minimumStarRating : null,
        notes,
        activityBrief: normalizedActivityBrief.brief ? JSON.stringify(normalizedActivityBrief.brief) : null,
        status: "draft",
      },
    });

    return NextResponse.json(trip);
  } catch (error: unknown) {
    console.error("POST /api/trips error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
