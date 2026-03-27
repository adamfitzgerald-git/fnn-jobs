import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — FNN Employment Hub" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const employerId = (session.user as any).employerId;

  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") {
    redirect("/dashboard");
  }

  const isSuperAdmin = role === "SUPER_ADMIN";

  const employerWhere = isSuperAdmin ? {} : { id: employerId };
  const jobWhere = isSuperAdmin ? {} : { employerId };

  const [employerCount, jobCount, eoiCount, userCount] = await Promise.all([
    prisma.employer.count({ where: employerWhere }),
    prisma.job.count({ where: jobWhere }),
    prisma.expressionOfInterest.count({ where: isSuperAdmin ? {} : { employerId } }),
    isSuperAdmin ? prisma.user.count() : Promise.resolve(0),
  ]);

  const recentEOIs = await prisma.expressionOfInterest.findMany({
    where: isSuperAdmin ? {} : { employerId },
    include: {
      user: { select: { name: true, email: true } },
      employer: { select: { name: true } },
      job: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-forest">Admin panel</h1>
          <p className="text-gray-600 mt-1">
            {isSuperAdmin ? "FNN Super Admin" : "Employer Admin"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-teal">{employerCount}</p>
          <p className="text-sm text-gray-500">Employers</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-teal">{jobCount}</p>
          <p className="text-sm text-gray-500">Job listings</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-teal">{eoiCount}</p>
          <p className="text-sm text-gray-500">Expressions of interest</p>
        </div>
        {isSuperAdmin && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <p className="text-3xl font-bold text-teal">{userCount}</p>
            <p className="text-sm text-gray-500">Registered users</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {isSuperAdmin && (
          <Link
            href="/admin/employers/new"
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-forest">+ New employer profile</h3>
            <p className="text-sm text-gray-500 mt-1">Create a new employer listing</p>
          </Link>
        )}
        <Link
          href="/admin/jobs/new"
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-forest">+ New job listing</h3>
          <p className="text-sm text-gray-500 mt-1">Post a new role</p>
        </Link>
        <Link
          href="/admin/employers"
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-forest">Manage employers</h3>
          <p className="text-sm text-gray-500 mt-1">View and edit employer profiles</p>
        </Link>
        <Link
          href="/admin/jobs"
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-forest">Manage jobs</h3>
          <p className="text-sm text-gray-500 mt-1">View and edit job listings</p>
        </Link>
      </div>

      {/* Recent EOIs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="font-heading text-xl font-semibold text-forest mb-4">
          Recent expressions of interest
        </h2>
        {recentEOIs.length === 0 ? (
          <p className="text-gray-500">No expressions of interest yet.</p>
        ) : (
          <div className="space-y-3">
            {recentEOIs.map((eoi) => (
              <div key={eoi.id} className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-forest">{eoi.user.name}</p>
                    <p className="text-sm text-gray-500">{eoi.user.email}</p>
                    {eoi.job && <p className="text-sm text-gray-500">Re: {eoi.job.title}</p>}
                    <p className="text-sm text-gray-500">To: {eoi.employer.name}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{eoi.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(eoi.createdAt).toLocaleDateString("en-AU")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
