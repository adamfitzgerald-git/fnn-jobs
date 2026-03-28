import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, jobAlertDigestHtml } from "@/lib/email";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const preferences = await prisma.alertPreference.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const recentJobs = await prisma.job.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: "PUBLISHED",
    },
    include: {
      employer: { select: { name: true, sector: true } },
    },
  });

  let emailsSent = 0;

  for (const pref of preferences) {
    const matchingJobs = recentJobs.filter(job => {
      const sectorMatch = pref.sectors.length === 0 || pref.sectors.includes(job.employer.sector || "");
      const locationMatch =
        pref.locations.length === 0 ||
        pref.locations.some(loc =>
          job.location.toLowerCase().includes(loc.toLowerCase())
        );
      return sectorMatch || locationMatch;
    });

    if (matchingJobs.length > 0) {
      const html = jobAlertDigestHtml({
        name: pref.user.name,
        jobs: matchingJobs.map(j => ({
          title: j.title,
          employer: j.employer.name,
          location: j.location,
          slug: j.slug,
        })),
      });

      await sendEmail({
        to: pref.user.email,
        subject: `${matchingJobs.length} new job${matchingJobs.length > 1 ? "s" : ""} matching your preferences — FNN Employment Hub`,
        html,
      });

      emailsSent++;
    }
  }

  return NextResponse.json({ success: true, emailsSent, totalPreferences: preferences.length });
}
