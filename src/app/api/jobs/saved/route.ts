import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ saved: false });
  }

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ saved: false });

  const savedJob = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: session.user.id, jobId } },
  });

  return NextResponse.json({ saved: !!savedJob });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await request.json();

  await prisma.savedJob.upsert({
    where: { userId_jobId: { userId: session.user.id, jobId } },
    create: { userId: session.user.id, jobId },
    update: {},
  });

  return NextResponse.json({ saved: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await request.json();

  await prisma.savedJob.deleteMany({
    where: { userId: session.user.id, jobId },
  });

  return NextResponse.json({ saved: false });
}
