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
      <EmployerForm employer={employer} />
    </div>
  );
}
