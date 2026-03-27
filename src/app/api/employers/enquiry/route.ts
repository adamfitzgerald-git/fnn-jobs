import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, eoiEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { employerId, message, jobId } = await request.json();

    if (!employerId || !message) {
      return NextResponse.json({ error: "Employer and message required" }, { status: 400 });
    }

    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
    });

    if (!employer) {
      return NextResponse.json({ error: "Employer not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create EOI record
    const eoi = await prisma.expressionOfInterest.create({
      data: {
        userId: session.user.id,
        employerId,
        jobId: jobId || null,
        message,
      },
    });

    // Get job title if jobId provided
    let jobTitle: string | undefined;
    if (jobId) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      jobTitle = job?.title;
    }

    // Send email to employer (non-blocking)
    if (employer.contactEmail) {
      sendEmail({
        to: employer.contactEmail,
        subject: `New enquiry from ${user.name} — FNN Employment Hub`,
        html: eoiEmailHtml({
          jobseekerName: user.name,
          jobseekerEmail: user.email,
          jobseekerBio: user.bio || undefined,
          message,
          jobTitle,
          employerName: employer.name,
        }),
      }).catch(console.error);
    }

    return NextResponse.json({ id: eoi.id }, { status: 201 });
  } catch (error) {
    console.error("EOI error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
