import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { MaturityForm } from "./MaturityForm";

export const dynamic = "force-dynamic";

export default async function MaturityPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { role, employerId } = session.user as any;
  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");

  const { id } = await params;
  if (role === "EMPLOYER_ADMIN" && employerId !== id) redirect("/admin");

  const employer = await prisma.employer.findUnique({
    where: { id },
    include: { maturityDimensions: true },
  });

  if (!employer) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <a href={`/admin/employers/${id}`} className="text-sm text-teal hover:underline">&larr; Back to {employer.name}</a>
        <h1 className="font-heading text-2xl font-bold text-forest mt-2">
          First Nations Engagement Maturity Profile
        </h1>
        <p className="text-gray-600 mt-1">
          Complete each dimension to build {employer.name}&apos;s engagement profile. This information is displayed publicly on your employer profile.
        </p>
      </div>
      <MaturityForm employerId={id} dimensions={employer.maturityDimensions} />
    </div>
  );
}
