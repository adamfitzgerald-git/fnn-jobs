import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PledgeStatusBadge } from "@/components/ui/PledgeStatusBadge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PledgesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { role, employerId } = session.user as any;
  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");

  const { id } = await params;
  if (role === "EMPLOYER_ADMIN" && employerId !== id) redirect("/admin");

  const employer = await prisma.employer.findUnique({
    where: { id },
    include: {
      commitmentPledges: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!employer) notFound();

  const pledges = employer.commitmentPledges;
  const atLimit = pledges.length >= 5;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href={`/admin/employers/${id}`}
          className="text-sm text-teal hover:underline"
        >
          &larr; Back to {employer.name}
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="font-heading text-2xl font-bold text-forest">
            Commitment Pledges
          </h1>
          {atLimit ? (
            <span className="text-sm text-gray-400 cursor-not-allowed bg-gray-100 px-4 py-2 rounded-md">
              Add pledge (limit reached)
            </span>
          ) : (
            <Link
              href={`/admin/employers/${id}/pledges/new`}
              className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add pledge
            </Link>
          )}
        </div>
        <p className="text-gray-600 mt-1">
          {pledges.length}/5 pledges used
        </p>
      </div>

      {pledges.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No commitment pledges yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pledges.map((pledge) => (
            <Link
              key={pledge.id}
              href={`/admin/employers/${id}/pledges/${pledge.id}`}
              className="block bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:border-teal/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-forest font-medium">{pledge.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {formatDate(pledge.dueDate)}
                  </p>
                </div>
                <PledgeStatusBadge status={pledge.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
