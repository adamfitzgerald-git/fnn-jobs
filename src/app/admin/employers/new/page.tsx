import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EmployerForm } from "../EmployerForm";

export const dynamic = "force-dynamic";

export default async function NewEmployerPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/admin");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin/employers" className="text-sm text-teal hover:underline">← Back to employers</Link>
      <h1 className="font-heading text-3xl font-bold text-forest mt-2 mb-8">New employer profile</h1>
      <EmployerForm />
    </div>
  );
}
