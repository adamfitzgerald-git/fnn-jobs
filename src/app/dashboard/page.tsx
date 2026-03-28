import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate, isClosingDatePassed, EMPLOYMENT_TYPES } from "@/lib/utils";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard — FNN Employment Hub",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Redirect admin users to admin panel
  if (session.user.role === "SUPER_ADMIN" || session.user.role === "EMPLOYER_ADMIN") {
    redirect("/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      savedJobs: {
        include: {
          job: {
            include: {
              employer: { select: { name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      expressionsOfInterest: {
        include: {
          employer: { select: { name: true, slug: true } },
          job: { select: { title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-forest mb-8">
        Welcome, {user.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Saved jobs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-heading text-xl font-semibold text-forest mb-4">
              Saved jobs ({user.savedJobs.length})
            </h2>
            {user.savedJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No saved jobs yet.</p>
                <Link href="/jobs" className="text-teal hover:underline text-sm mt-2 inline-block">
                  Browse job listings
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.savedJobs.map(({ job }) => {
                  const closed = job.status === "CLOSED" || isClosingDatePassed(job.closingDate);
                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.slug}`}
                      className="block p-4 rounded-lg border border-gray-100 hover:border-teal/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-forest">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {job.employer.name} · {job.location} · {EMPLOYMENT_TYPES[job.employmentType]}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            closed
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {closed ? "Closed" : "Open"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expressions of interest */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-heading text-xl font-semibold text-forest mb-4">
              Expressions of interest ({user.expressionsOfInterest.length})
            </h2>
            {user.expressionsOfInterest.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No expressions of interest sent yet.</p>
                <Link href="/employers" className="text-teal hover:underline text-sm mt-2 inline-block">
                  Browse employers
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.expressionsOfInterest.map((eoi) => (
                  <div
                    key={eoi.id}
                    className="p-4 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/employers/${eoi.employer.slug}`}
                          className="font-semibold text-forest hover:text-teal"
                        >
                          {eoi.employer.name}
                        </Link>
                        {eoi.job && (
                          <p className="text-sm text-gray-500">
                            Re: {eoi.job.title}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {eoi.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(eoi.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — edit profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="font-heading text-lg font-semibold text-forest mb-4">
              Your profile
            </h2>
            <ProfileForm
              name={user.name}
              bio={user.bio || ""}
              location={user.location || ""}
              emailNotifications={user.emailNotifications}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-heading text-lg font-semibold text-forest mb-4">Settings</h2>
            <div className="space-y-2">
              <a href="/dashboard/alerts" className="block text-sm text-teal hover:underline">Email Job Alerts</a>
              <a href="/dashboard/data-sovereignty" className="block text-sm text-teal hover:underline">Your Data (Coming Soon)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
