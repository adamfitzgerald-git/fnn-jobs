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

  const employer = await prisma.employer.findUnique({
    where: { id },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
      _count: { select: { expressionsOfInterest: true } },
    },
  });

  if (!employer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(employer);
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

    // Employer admins can't change slug or status
    if (role === "EMPLOYER_ADMIN") {
      delete data.slug;
      delete data.status;
    }

    const employer = await prisma.employer.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.sector !== undefined && { sector: data.sector }),
        ...(data.headquarters !== undefined && { headquarters: data.headquarters }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.fullDescription !== undefined && { fullDescription: data.fullDescription }),
        ...(data.rapTier !== undefined && { rapTier: data.rapTier }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.photoGallery !== undefined && { photoGallery: data.photoGallery }),
        ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl }),
        ...(data.facebookUrl !== undefined && { facebookUrl: data.facebookUrl }),
        ...(data.instagramUrl !== undefined && { instagramUrl: data.instagramUrl }),
        ...(data.xUrl !== undefined && { xUrl: data.xUrl }),
        ...(data.contactName !== undefined && { contactName: data.contactName }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.status !== undefined && role === "SUPER_ADMIN" && { status: data.status }),
      },
    });

    return NextResponse.json(employer);
  } catch (error) {
    console.error("Update employer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.employer.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
