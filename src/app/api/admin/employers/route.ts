import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, employerId } = session.user as any;

  if (role === "SUPER_ADMIN") {
    const employers = await prisma.employer.findMany({
      include: { _count: { select: { jobs: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(employers);
  }

  if (role === "EMPLOYER_ADMIN" && employerId) {
    const employers = await prisma.employer.findMany({
      where: { id: employerId },
      include: { _count: { select: { jobs: true } } },
    });
    return NextResponse.json(employers);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();
    const slug = slugify(data.name);

    const existing = await prisma.employer.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "An employer with this name already exists" }, { status: 400 });
    }

    const employer = await prisma.employer.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo || null,
        sector: data.sector,
        headquarters: data.headquarters || null,
        websiteUrl: data.websiteUrl || null,
        shortDescription: data.shortDescription || null,
        fullDescription: data.fullDescription || null,
        rapTier: data.rapTier || "NONE",
        videoUrl: data.videoUrl || null,
        photoGallery: data.photoGallery || [],
        linkedinUrl: data.linkedinUrl || null,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        xUrl: data.xUrl || null,
        contactName: data.contactName || null,
        contactEmail: data.contactEmail || null,
        status: data.status || "DRAFT",
        spotlightUrl: data.spotlightUrl || null,
        spotlightTitle: data.spotlightTitle || null,
        groVerified: data.groVerified || false,
        ibmPartner: data.ibmPartner || false,
      },
    });

    return NextResponse.json(employer, { status: 201 });
  } catch (error) {
    console.error("Create employer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
