import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, employerId } = session.user as any;

  const where: any = {};
  if (role === "EMPLOYER_ADMIN" && employerId) {
    where.employerId = employerId;
  } else if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const eois = await prisma.expressionOfInterest.findMany({
    where,
    include: {
      user: { select: { name: true, email: true, bio: true } },
      employer: { select: { name: true } },
      job: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(eois);
}
