import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { RapProgressForm } from "../RapProgressForm";

export const dynamic = "force-dynamic";

export default async function NewRapProgressPage({
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

  const employer = await prisma.employer.findUnique({ where: { id } });
  if (!employer) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a
        href={`/admin/employers/${id}/rap-progress`}
        className="text-sm text-teal hover:underline"
      >
        &larr; Back to RAP Progress
      </a>
      <h1 className="font-heading text-2xl font-bold text-forest mt-2 mb-8">
        Add Progress Year — {employer.name}
      </h1>
      <RapProgressForm employerId={id} />
    </div>
  );
}
