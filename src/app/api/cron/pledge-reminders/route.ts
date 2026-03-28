import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const pledges = await prisma.commitmentPledge.findMany({
      where: {
        status: "ACTIVE",
        dueDate: { lte: thirtyDaysFromNow },
        reminderSentAt: null,
      },
      include: {
        employer: {
          select: { name: true, contactEmail: true },
        },
      },
    });

    let sent = 0;

    for (const pledge of pledges) {
      if (!pledge.employer.contactEmail) continue;

      const dueDate = new Date(pledge.dueDate).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await sendEmail({
        to: pledge.employer.contactEmail,
        subject: `Commitment pledge reminder — ${pledge.employer.name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1A2420;">Commitment Pledge Reminder</h2>
            <p>Hi ${pledge.employer.name},</p>
            <p>This is a reminder that your commitment pledge is due on <strong>${dueDate}</strong>:</p>
            <blockquote style="background: #F5F1EB; padding: 15px; border-radius: 6px; border-left: 4px solid #1D9E75;">
              ${pledge.text}
            </blockquote>
            <p>Please log in to the <a href="${process.env.NEXTAUTH_URL}">FNN Employment Hub</a> to update the status of your pledge.</p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">— The FNN Employment Hub Team</p>
          </div>
        `,
      });

      await prisma.commitmentPledge.update({
        where: { id: pledge.id },
        data: { reminderSentAt: new Date() },
      });

      sent++;
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Pledge reminder cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
