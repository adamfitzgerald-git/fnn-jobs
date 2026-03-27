import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EMPLOYMENT_TYPES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const employerId = (session.user as any).employerId;

  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");

  const where = role === "SUPER_ADMIN" ? {} : { employerId };

  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: { select: { name: true } },
      _count: { select: { expressionsOfInterest: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-teal hover:underline">← Back to admin</Link>
          <h1 className="font-heading text-3xl font-bold text-forest mt-2">Job listings</h1>
        </div>
        <Link
          href="/admin/jobs/new"
          className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          + New job
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream">
              <th className="text-left px-6 py-3 font-medium text-forest">Title</th>
              <th className="text-left px-6 py-3 font-medium text-forest">Employer</th>
              <th className="text-left px-6 py-3 font-medium text-forest">Type</th>
              <th className="text-left px-6 py-3 font-medium text-forest">EOIs</th>
              <th className="text-left px-6 py-3 font-medium text-forest">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <span className="font-medium text-forest">{j.title}</span>
                  {j.identifiedRole && <span className="ml-2 text-xs bg-amber/20 text-amber px-1.5 py-0.5 rounded">Identified</span>}
                </td>
                <td className="px-6 py-4 text-gray-600">{j.employer.name}</td>
                <td className="px-6 py-4 text-gray-600">{EMPLOYMENT_TYPES[j.employmentType]}</td>
                <td className="px-6 py-4 text-gray-600">{j._count.expressionsOfInterest}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    j.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                    j.status === "CLOSED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {j.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/jobs/${j.id}`} className="text-teal hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">No job listings yet.</div>
        )}
      </div>
    </div>
  );
}
