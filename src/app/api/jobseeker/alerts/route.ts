import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  if ((session.user as any).role !== "JOBSEEKER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const preference = await prisma.alertPreference.findUnique({
    where: { userId },
  });

  return NextResponse.json(preference || { sectors: [], locations: [] });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  if ((session.user as any).role !== "JOBSEEKER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { sectors, locations } = body as { sectors: string[]; locations: string[] };

  const preference = await prisma.alertPreference.upsert({
    where: { userId },
    update: { sectors, locations },
    create: { userId, sectors, locations },
  });

  return NextResponse.json(preference);
}
