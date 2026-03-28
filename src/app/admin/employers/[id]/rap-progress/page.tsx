import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  MET: { label: "Met", className: "bg-green-100 text-green-800" },
  PARTIALLY_MET: { label: "Partially met", className: "bg-amber-100 text-amber-800" },
  NOT_MET: { label: "Not met", className: "bg-red-100 text-red-800" },
  IN_PROGRESS: { label: "In progress", className: "bg-gray-100 text-gray-700" },
};

export default async function RapProgressListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const { role, employerId } = session.user as any;

  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");
  if (role === "EMPLOYER_ADMIN" && employerId !== id) redirect("/admin");

  const employer = await prisma.employer.findUnique({
    where: { id },
    include: {
      rapProgress: { orderBy: { year: "desc" } },
    },
  });

  if (!employer) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <a href={`/admin/employers/${id}`} className="text-sm text-teal hover:underline">
          &larr; Back to {employer.name}
        </a>
        <div className="flex items-center justify-between mt-2">
          <h1 className="font-heading text-2xl font-bold text-forest">
            RAP Progress Tracker
          </h1>
          <Link
            href={`/admin/employers/${id}/rap-progress/new`}
            className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Add Year
          </Link>
        </div>
        <p className="text-gray-600 mt-1">
          Annual progress entries for {employer.name}&apos;s Reconciliation Action Plan.
        </p>
      </div>

      {employer.rapProgress.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No progress entries yet.</p>
          <Link
            href={`/admin/employers/${id}/rap-progress/new`}
            className="text-teal hover:underline text-sm mt-2 inline-block"
          >
            Add your first year
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {employer.rapProgress.map((entry) => {
            const badge = STATUS_BADGES[entry.targetMet] || STATUS_BADGES.IN_PROGRESS;
            return (
              <Link
                key={entry.id}
                href={`/admin/employers/${id}/rap-progress/${entry.id}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:border-teal/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-forest">
                      {entry.year}
                    </h2>
                    {entry.targetSet && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {entry.targetSet}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
