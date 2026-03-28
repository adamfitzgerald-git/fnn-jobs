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

  const pledges = await prisma.commitmentPledge.findMany({
    where: { employerId: id },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(pledges);
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
    const count = await prisma.commitmentPledge.count({
      where: { employerId: id },
    });

    if (count >= 5) {
      return NextResponse.json(
        { error: "Maximum of 5 pledges reached" },
        { status: 400 }
      );
    }

    const data = await request.json();

    const pledge = await prisma.commitmentPledge.create({
      data: {
        employerId: id,
        text: data.text,
        dueDate: new Date(data.dueDate),
        status: data.status || "ACTIVE",
      },
    });

    return NextResponse.json(pledge, { status: 201 });
  } catch (error) {
    console.error("Create pledge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
