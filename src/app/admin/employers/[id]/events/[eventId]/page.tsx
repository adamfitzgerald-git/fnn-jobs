import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { EventForm } from "../EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { role, employerId } = session.user as any;
  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");

  const { id, eventId } = await params;
  if (role === "EMPLOYER_ADMIN" && employerId !== id) redirect("/admin");

  const event = await prisma.event.findUnique({
    where: { id: eventId, employerId: id },
  });

  if (!event) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/admin/employers/${id}/events`}
        className="text-sm text-teal hover:underline"
      >
        &larr; Back to events
      </Link>
      <h1 className="font-heading text-2xl font-bold text-forest mt-2 mb-8">
        Edit event
      </h1>
      <EventForm event={event} employerId={id} />
    </div>
  );
}
