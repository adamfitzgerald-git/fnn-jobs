import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { role, employerId: userEmployerId } = session.user as any;
  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");

  const { id } = await params;
  if (role === "EMPLOYER_ADMIN" && userEmployerId !== id) redirect("/admin");

  const employer = await prisma.employer.findUnique({ where: { id } });
  if (!employer) notFound();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [profileViews30, profileViews90, jobViews30, totalEois, jobs] = await Promise.all([
    prisma.pageView.count({ where: { employerId: id, jobId: null, viewedAt: { gte: thirtyDaysAgo } } }),
    prisma.pageView.count({ where: { employerId: id, jobId: null, viewedAt: { gte: ninetyDaysAgo } } }),
    prisma.pageView.count({ where: { employerId: id, jobId: { not: null }, viewedAt: { gte: thirtyDaysAgo } } }),
    prisma.expressionOfInterest.count({ where: { employerId: id } }),
    prisma.job.findMany({
      where: { employerId: id },
      include: {
        _count: { select: { pageViews: true, expressionsOfInterest: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/admin/employers/${id}`} className="text-sm text-teal hover:underline">&larr; Back to {employer.name}</a>
      <h1 className="font-heading text-2xl font-bold text-forest mt-2 mb-8">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Profile views (30d)", value: profileViews30 },
          { label: "Profile views (90d)", value: profileViews90 },
          { label: "Job views (30d)", value: jobViews30 },
          { label: "Total EOIs", value: totalEois },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-forest">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading text-lg font-semibold text-forest">Listing Performance</h2>
        </div>
        {jobs.length === 0 ? (
          <p className="px-6 py-8 text-gray-500 text-center">No listings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Job title</th>
                <th className="px-6 py-3 font-medium text-right">Views</th>
                <th className="px-6 py-3 font-medium text-right">EOIs</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-50">
                  <td className="px-6 py-3 text-forest font-medium">{job.title}</td>
                  <td className="px-6 py-3 text-right">{job._count.pageViews}</td>
                  <td className="px-6 py-3 text-right">{job._count.expressionsOfInterest}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                      job.status === "DRAFT" ? "bg-gray-100 text-gray-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
