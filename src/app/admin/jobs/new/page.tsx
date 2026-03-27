import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { JobForm } from "../JobForm";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const employerId = (session.user as any).employerId;

  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/admin");

  // Get employers list for super admin to pick from
  const employers = role === "SUPER_ADMIN"
    ? await prisma.employer.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
    : employerId
    ? await prisma.employer.findMany({ where: { id: employerId }, select: { id: true, name: true } })
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin/jobs" className="text-sm text-teal hover:underline">← Back to jobs</Link>
      <h1 className="font-heading text-3xl font-bold text-forest mt-2 mb-8">New job listing</h1>
      <JobForm employers={employers} isSuperAdmin={role === "SUPER_ADMIN"} />
    </div>
  );
}
