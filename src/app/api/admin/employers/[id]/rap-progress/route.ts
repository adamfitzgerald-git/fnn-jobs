import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { role, employerId } = session.user as any;

  if (role !== "SUPER_ADMIN" && employerId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const entries = await prisma.rapProgress.findMany({
    where: { employerId: id },
    orderBy: { year: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { role, employerId } = session.user as any;

  if (role !== "SUPER_ADMIN" && employerId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();
    const { year, targetSet, achieved, initiatives, targetMet, externalLink, nextYearTarget } = data;

    if (!year) {
      return NextResponse.json({ error: "year is required" }, { status: 400 });
    }

    const entry = await prisma.rapProgress.create({
      data: {
        employerId: id,
        year: parseInt(year, 10),
        targetSet: targetSet || null,
        achieved: achieved || null,
        initiatives: initiatives || null,
        targetMet: targetMet || "IN_PROGRESS",
        externalLink: externalLink || null,
        nextYearTarget: nextYearTarget || null,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.error("RAP progress create error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "An entry for this year already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
