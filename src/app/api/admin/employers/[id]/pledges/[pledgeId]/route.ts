import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; pledgeId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, pledgeId } = await params;
  const { role, employerId } = session.user as any;

  if (role !== "SUPER_ADMIN" && employerId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();

    const pledge = await prisma.commitmentPledge.update({
      where: { id: pledgeId, employerId: id },
      data: {
        ...(data.text !== undefined && { text: data.text }),
        ...(data.dueDate !== undefined && { dueDate: new Date(data.dueDate) }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    return NextResponse.json(pledge);
  } catch (error) {
    console.error("Update pledge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; pledgeId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, pledgeId } = await params;
  const { role, employerId } = session.user as any;

  if (role !== "SUPER_ADMIN" && employerId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.commitmentPledge.delete({
    where: { id: pledgeId, employerId: id },
  });

  return NextResponse.json({ success: true });
}
