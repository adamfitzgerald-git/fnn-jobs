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

  const dimensions = await prisma.maturityDimension.findMany({
    where: { employerId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(dimensions);
}

export async function PUT(
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
    const { dimension, summary, initiatives, evidence, status } = data;

    if (!dimension) {
      return NextResponse.json({ error: "dimension is required" }, { status: 400 });
    }

    const result = await prisma.maturityDimension.upsert({
      where: {
        employerId_dimension: {
          employerId: id,
          dimension,
        },
      },
      update: {
        summary: summary ?? null,
        initiatives: initiatives ?? null,
        evidence: evidence ?? null,
        status: status ?? null,
      },
      create: {
        employerId: id,
        dimension,
        summary: summary ?? null,
        initiatives: initiatives ?? null,
        evidence: evidence ?? null,
        status: status ?? null,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Maturity dimension upsert error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
