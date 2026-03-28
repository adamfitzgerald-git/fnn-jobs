import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RapBadge } from "@/components/ui/RapBadge";
import { IdentifiedBadge } from "@/components/ui/IdentifiedBadge";
import { formatDate, EMPLOYMENT_TYPES, WORK_MODES, isClosingDatePassed } from "@/lib/utils";
import Link from "next/link";
import { SaveJobButton } from "./SaveJobButton";
import { KnowBeforeYouApply } from "@/components/jobs/KnowBeforeYouApply";
import { TrackPageView } from "@/components/analytics/TrackPageView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug },
    include: { employer: { select: { name: true } } },
  });
  if (!job) return {};
  return {
    title: `${job.title} at ${job.employer.name} — FNN Employment Hub`,
    description: `${job.title} — ${job.location} — ${EMPLOYMENT_TYPES[job.employmentType]}`,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      employer: {
        include: {
          maturityDimensions: true,
        },
      },
    },
  });

  if (!job) notFound();

  const closed = isClosingDatePassed(job.closingDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/jobs" className="text-sm text-teal hover:underline mb-6 inline-block">
        ← Back to all jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="flex items-start gap-4 mb-6">
              <Link
                href={`/employers/${job.employer.slug}`}
                className="w-16 h-16 rounded-lg bg-cream flex items-center justify-center flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
              >
                {job.employer.logo ? (
                  <img src={job.employer.logo} alt={job.employer.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-2xl font-heading font-bold text-forest/40">
                    {job.employer.name.charAt(0)}
                  </span>
                )}
              </Link>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-forest">
                  {job.title}
                </h1>
                <Link
                  href={`/employers/${job.employer.slug}`}
                  className="text-teal hover:underline"
                >
                  {job.employer.name}
                </Link>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {job.identifiedRole && <IdentifiedBadge size="lg" />}
              {job.employer.rapTier !== "NONE" && (
                <RapBadge tier={job.employer.rapTier} size="lg" />
              )}
              {closed && (
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                  Closed
                </span>
              )}
            </div>

            {/* Identified role callout */}
            {job.identifiedRole && (
              <div className="bg-amber/10 border border-amber/30 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-forest">
                  Identified Role — open to Aboriginal and Torres Strait Islander applicants.
                </p>
              </div>
            )}

            {/* Job description */}
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-heading text-lg font-semibold text-forest mb-4">
              Job details
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Location</dt>
                <dd className="font-medium text-forest">{job.location}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Work mode</dt>
                <dd className="font-medium text-forest">{WORK_MODES[job.workMode]}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Employment type</dt>
                <dd className="font-medium text-forest">{EMPLOYMENT_TYPES[job.employmentType]}</dd>
              </div>
              {job.salaryRange && (
                <div>
                  <dt className="text-gray-500">Salary</dt>
                  <dd className="font-medium text-forest">{job.salaryRange}</dd>
                </div>
              )}
              {job.closingDate && (
                <div>
                  <dt className="text-gray-500">Closing date</dt>
                  <dd className={`font-medium ${closed ? "text-red-600" : "text-forest"}`}>
                    {formatDate(job.closingDate)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Know Before You Apply */}
          <KnowBeforeYouApply dimensions={job.employer.maturityDimensions} rapTier={job.employer.rapTier} />

          {/* Apply card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {closed ? (
              <p className="text-center text-gray-500">This role has closed.</p>
            ) : (
              <>
                {job.applyMethod === "EMAIL" ? (
                  <a
                    href={`mailto:${job.applyValue}?subject=Application: ${encodeURIComponent(job.title)}`}
                    className="block w-full bg-teal hover:bg-teal-dark text-white text-center py-3 rounded-md font-medium transition-colors"
                  >
                    Apply via email
                  </a>
                ) : (
                  <a
                    href={job.applyValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-teal hover:bg-teal-dark text-white text-center py-3 rounded-md font-medium transition-colors"
                  >
                    Apply now ↗
                  </a>
                )}
              </>
            )}
            <div className="mt-3">
              <SaveJobButton jobId={job.id} />
            </div>
          </div>

          {/* Employer card */}
          <Link
            href={`/employers/${job.employer.slug}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center flex-shrink-0">
                {job.employer.logo ? (
                  <img src={job.employer.logo} alt={job.employer.name} className="w-full h-full object-contain p-0.5" />
                ) : (
                  <span className="text-sm font-heading font-bold text-forest/40">
                    {job.employer.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-forest text-sm">{job.employer.name}</p>
                <p className="text-xs text-gray-500">{job.employer.sector}</p>
              </div>
            </div>
            {job.employer.rapTier !== "NONE" && (
              <div className="mt-2">
                <RapBadge tier={job.employer.rapTier} />
              </div>
            )}
            <p className="text-sm text-teal mt-2">View employer profile →</p>
          </Link>
        </div>
      </div>
      <TrackPageView employerId={job.employerId} jobId={job.id} />
    </div>
  );
}
