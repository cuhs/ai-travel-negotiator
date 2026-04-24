import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.user.upsert({
    where: { id: "user_1" },
    update: {},
    create: {
      id: "user_1",
      email: "demo@travelnegotiator.ai",
      name: "Demo User",
    },
  });
  return NextResponse.json({ success: true });
}
