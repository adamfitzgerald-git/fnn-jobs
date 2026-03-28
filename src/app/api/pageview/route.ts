import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { employerId, jobId } = body;

  await prisma.pageView.create({
    data: {
      ...(employerId ? { employerId } : {}),
      ...(jobId ? { jobId } : {}),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
