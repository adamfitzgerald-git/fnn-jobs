import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; progressId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, progressId } = await params;
  const { role, employerId } = session.user as any;

  if (role !== "SUPER_ADMIN" && employerId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();
    const { year, targetSet, achieved, initiatives, targetMet, externalLink, nextYearTarget } = data;

    const entry = await prisma.rapProgress.update({
      where: { id: progressId, employerId: id },
      data: {
        year: year ? parseInt(year, 10) : undefined,
        targetSet: targetSet ?? null,
        achieved: achieved ?? null,
        initiatives: initiatives ?? null,
        targetMet: targetMet || undefined,
        externalLink: externalLink ?? null,
        nextYearTarget: nextYearTarget ?? null,
      },
    });

    return NextResponse.json(entry);
  } catch (error: any) {
    console.error("RAP progress update error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "An entry for this year already exists" }, { status: 409 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; progressId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, progressId } = await params;
  const { role, employerId } = session.user as any;

  if (role !== "SUPER_ADMIN" && employerId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.rapProgress.delete({
      where: { id: progressId, employerId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("RAP progress delete error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
