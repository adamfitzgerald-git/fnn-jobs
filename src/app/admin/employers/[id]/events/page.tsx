import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { role, employerId } = session.user as any;
  if (role !== "SUPER_ADMIN" && role !== "EMPLOYER_ADMIN") redirect("/dashboard");

  const { id } = await params;
  if (role === "EMPLOYER_ADMIN" && employerId !== id) redirect("/admin");

  const employer = await prisma.employer.findUnique({
    where: { id },
    include: {
      events: { orderBy: { date: "asc" } },
    },
  });

  if (!employer) notFound();

  const events = employer.events;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href={`/admin/employers/${id}`}
          className="text-sm text-teal hover:underline"
        >
          &larr; Back to {employer.name}
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="font-heading text-2xl font-bold text-forest">
            Events
          </h1>
          <Link
            href={`/admin/employers/${id}/events/new`}
            className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add event
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No events yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/admin/employers/${id}/events/${event.id}`}
              className="block bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:border-teal/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-forest font-medium">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(event.date)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
