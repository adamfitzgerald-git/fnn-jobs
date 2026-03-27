import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { JobForm } from "../JobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const role = (session.user as any).role;
  const employerId = (session.user as any).employerId;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { employer: { select: { id: true, name: true } } },
  });

  if (!job) notFound();
  if (role !== "SUPER_ADMIN" && job.employerId !== employerId) redirect("/admin");

  const employers = role === "SUPER_ADMIN"
    ? await prisma.employer.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
    : [job.employer];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin/jobs" className="text-sm text-teal hover:underline">← Back to jobs</Link>
      <h1 className="font-heading text-3xl font-bold text-forest mt-2 mb-8">Edit: {job.title}</h1>
      <JobForm job={job} employers={employers} isSuperAdmin={role === "SUPER_ADMIN"} />
    </div>
  );
}
