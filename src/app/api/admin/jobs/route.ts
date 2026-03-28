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

  const where: any = {};
  if (role === "EMPLOYER_ADMIN" && employerId) {
    where.employerId = employerId;
  } else if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: { select: { name: true, slug: true } },
      _count: { select: { expressionsOfInterest: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, employerId } = session.user as any;
  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();

    // Employer admins can only create jobs for their own employer
    const targetEmployerId = role === "EMPLOYER_ADMIN" ? employerId : data.employerId;
    if (!targetEmployerId) {
      return NextResponse.json({ error: "Employer is required" }, { status: 400 });
    }

    const slug = slugify(data.title) + "-" + Date.now().toString(36);

    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug,
        employerId: targetEmployerId,
        location: data.location,
        workMode: data.workMode || "ON_SITE",
        employmentType: data.employmentType || "FULL_TIME",
        salaryRange: data.salaryRange || null,
        identifiedRole: data.identifiedRole || false,
        featured: data.featured || false,
        description: data.description,
        applyMethod: data.applyMethod || "EMAIL",
        applyValue: data.applyValue,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        status: data.status || "DRAFT",
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
