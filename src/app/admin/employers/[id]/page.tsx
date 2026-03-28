import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { EmployerForm } from "../EmployerForm";

export const dynamic = "force-dynamic";

export default async function EditEmployerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const role = (session.user as any).role;
  const employerId = (session.user as any).employerId;

  if (role !== "SUPER_ADMIN" && employerId !== id) redirect("/admin");

  const employer = await prisma.employer.findUnique({ where: { id } });
  if (!employer) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin/employers" className="text-sm text-teal hover:underline">← Back to employers</Link>
      <h1 className="font-heading text-3xl font-bold text-forest mt-2 mb-8">Edit: {employer.name}</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="font-heading text-lg font-semibold text-forest mb-4">Employer Hub</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href={`/admin/employers/${id}/maturity`} className="block p-4 rounded-lg border border-gray-200 hover:border-teal/40 hover:shadow-sm transition-all text-center">
            <span className="text-2xl">📊</span>
            <p className="text-sm font-medium text-forest mt-1">Maturity Profile</p>
          </Link>
          <Link href={`/admin/employers/${id}/rap-progress`} className="block p-4 rounded-lg border border-gray-200 hover:border-teal/40 hover:shadow-sm transition-all text-center">
            <span className="text-2xl">📈</span>
            <p className="text-sm font-medium text-forest mt-1">RAP Progress</p>
          </Link>
          <Link href={`/admin/employers/${id}/pledges`} className="block p-4 rounded-lg border border-gray-200 hover:border-teal/40 hover:shadow-sm transition-all text-center">
            <span className="text-2xl">🎯</span>
            <p className="text-sm font-medium text-forest mt-1">Pledges</p>
          </Link>
          <Link href={`/admin/employers/${id}/events`} className="block p-4 rounded-lg border border-gray-200 hover:border-teal/40 hover:shadow-sm transition-all text-center">
            <span className="text-2xl">📅</span>
            <p className="text-sm font-medium text-forest mt-1">Events</p>
          </Link>
          <Link href={`/admin/employers/${id}/analytics`} className="block p-4 rounded-lg border border-gray-200 hover:border-teal/40 hover:shadow-sm transition-all text-center">
            <span className="text-2xl">📉</span>
            <p className="text-sm font-medium text-forest mt-1">Analytics</p>
          </Link>
        </div>
      </div>

      <EmployerForm employer={employer} />
    </div>
  );
}
