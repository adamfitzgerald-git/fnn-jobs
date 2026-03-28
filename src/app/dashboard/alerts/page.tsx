import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AlertPreferenceForm } from "./AlertPreferenceForm";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id, role } = session.user as any;
  if (role !== "JOBSEEKER") redirect("/admin");

  const preference = await prisma.alertPreference.findUnique({ where: { userId: id } });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href="/dashboard" className="text-sm text-teal hover:underline">&larr; Back to dashboard</a>
      <h1 className="font-heading text-2xl font-bold text-forest mt-2 mb-2">Email Job Alerts</h1>
      <p className="text-gray-600 mb-8">Get a weekly digest of new jobs matching your preferences.</p>
      <AlertPreferenceForm
        sectors={preference?.sectors || []}
        locations={preference?.locations || []}
      />
    </div>
  );
}
