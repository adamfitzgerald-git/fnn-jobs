import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminEmployersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const employerId = (session.user as any).employerId;

  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");

  const where = role === "SUPER_ADMIN" ? {} : { id: employerId };

  const employers = await prisma.employer.findMany({
    where,
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-teal hover:underline">← Back to admin</Link>
          <h1 className="font-heading text-3xl font-bold text-forest mt-2">Employers</h1>
        </div>
        {role === "SUPER_ADMIN" && (
          <Link
            href="/admin/employers/new"
            className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + New employer
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream">
              <th className="text-left px-6 py-3 font-medium text-forest">Name</th>
              <th className="text-left px-6 py-3 font-medium text-forest">Sector</th>
              <th className="text-left px-6 py-3 font-medium text-forest">RAP</th>
              <th className="text-left px-6 py-3 font-medium text-forest">Jobs</th>
              <th className="text-left px-6 py-3 font-medium text-forest">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {employers.map((e) => (
              <tr key={e.id} className="border-t border-gray-100">
                <td className="px-6 py-4 font-medium text-forest">{e.name}</td>
                <td className="px-6 py-4 text-gray-600">{e.sector}</td>
                <td className="px-6 py-4 text-gray-600">{e.rapTier === "NONE" ? "—" : e.rapTier}</td>
                <td className="px-6 py-4 text-gray-600">{e._count.jobs}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    e.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/employers/${e.id}`} className="text-teal hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employers.length === 0 && (
          <div className="text-center py-12 text-gray-500">No employers yet.</div>
        )}
      </div>
    </div>
  );
}
