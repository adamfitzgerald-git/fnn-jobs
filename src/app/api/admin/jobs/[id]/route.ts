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

  const job = await prisma.job.findUnique({
    where: { id },
    include: { employer: { select: { name: true, id: true } } },
  });

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (role !== "SUPER_ADMIN" && job.employerId !== employerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(job);
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

  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (role !== "SUPER_ADMIN" && existing.employerId !== employerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();

    const job = await prisma.job.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.workMode !== undefined && { workMode: data.workMode }),
        ...(data.employmentType !== undefined && { employmentType: data.employmentType }),
        ...(data.salaryRange !== undefined && { salaryRange: data.salaryRange }),
        ...(data.identifiedRole !== undefined && { identifiedRole: data.identifiedRole }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.applyMethod !== undefined && { applyMethod: data.applyMethod }),
        ...(data.applyValue !== undefined && { applyValue: data.applyValue }),
        ...(data.closingDate !== undefined && {
          closingDate: data.closingDate ? new Date(data.closingDate) : null,
        }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { role, employerId } = session.user as any;

  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (role !== "SUPER_ADMIN" && existing.employerId !== employerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.job.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
