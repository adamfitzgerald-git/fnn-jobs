import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RapBadge } from "@/components/ui/RapBadge";
import { IdentifiedBadge } from "@/components/ui/IdentifiedBadge";
import { formatDate, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/utils";
import Link from "next/link";
import { EnquiryForm } from "./EnquiryForm";
import { MaturityProfile } from "@/components/employers/MaturityProfile";
import { RapTimeline } from "@/components/employers/RapTimeline";
import { GroVerifiedSection } from "@/components/employers/GroVerifiedSection";
import { PledgeList } from "@/components/employers/PledgeList";
import { EventList } from "@/components/employers/EventList";
import { TrackPageView } from "@/components/analytics/TrackPageView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const employer = await prisma.employer.findUnique({ where: { slug } });
  if (!employer) return {};
  return {
    title: `${employer.name} — FNN Employment Hub`,
    description: employer.shortDescription || `${employer.name} employer profile on FNN Employment Hub.`,
  };
}

export default async function EmployerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const employer = await prisma.employer.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      jobs: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      },
      maturityDimensions: true,
      rapProgress: { orderBy: { year: "desc" as const } },
      commitmentPledges: { orderBy: { dueDate: "asc" as const } },
      events: { where: { date: { gte: new Date() } }, orderBy: { date: "asc" as const } },
    },
  });

  if (!employer) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-xl bg-cream flex items-center justify-center flex-shrink-0 overflow-hidden">
            {employer.logo ? (
              <img src={employer.logo} alt={employer.name} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-4xl font-heading font-bold text-forest/40">
                {employer.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-3xl font-bold text-forest">
              {employer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-gray-600">{employer.sector}</span>
              {employer.headquarters && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-600">{employer.headquarters}</span>
                </>
              )}
              {employer.rapTier !== "NONE" && <RapBadge tier={employer.rapTier} size="lg" />}
            </div>
            {employer.shortDescription && (
              <p className="mt-3 text-gray-600">{employer.shortDescription}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              {employer.websiteUrl && (
                <a
                  href={employer.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal hover:underline"
                >
                  Website ↗
                </a>
              )}
              {employer.linkedinUrl && (
                <a href={employer.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-teal hover:underline">
                  LinkedIn ↗
                </a>
              )}
              {employer.facebookUrl && (
                <a href={employer.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-teal hover:underline">
                  Facebook ↗
                </a>
              )}
              {employer.instagramUrl && (
                <a href={employer.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-teal hover:underline">
                  Instagram ↗
                </a>
              )}
              {employer.xUrl && (
                <a href={employer.xUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-teal hover:underline">
                  X ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Full description */}
          {employer.fullDescription && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading text-xl font-semibold text-forest mb-4">
                About {employer.name}
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: employer.fullDescription }}
              />
            </div>
          )}

          {/* Maturity Profile */}
          {employer.maturityDimensions.length > 0 && (
            <MaturityProfile dimensions={employer.maturityDimensions} />
          )}

          {/* RAP Progress */}
          {employer.rapProgress.length > 0 && (
            <RapTimeline entries={employer.rapProgress} />
          )}

          {/* Video */}
          {employer.videoUrl && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading text-xl font-semibold text-forest mb-4">
                Video
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={employer.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/").replace("vimeo.com/", "player.vimeo.com/video/")}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>
            </div>
          )}

          {/* Photo gallery */}
          {employer.photoGallery.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading text-xl font-semibold text-forest mb-4">
                Team & Culture
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {employer.photoGallery.map((photo, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden bg-cream">
                    <img src={photo} alt={`${employer.name} team photo ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commitment Pledges */}
          {employer.commitmentPledges.length > 0 && (
            <PledgeList pledges={employer.commitmentPledges} />
          )}

          {/* Upcoming Events */}
          {employer.events.length > 0 && (
            <EventList events={employer.events} />
          )}

          {/* Open roles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="font-heading text-xl font-semibold text-forest mb-4">
              Open Roles ({employer.jobs.length})
            </h2>
            {employer.jobs.length === 0 ? (
              <p className="text-gray-500">No open roles at the moment.</p>
            ) : (
              <div className="space-y-4">
                {employer.jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="block p-4 rounded-lg border border-gray-100 hover:border-teal/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-forest">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                          <span>{job.location}</span>
                          <span>·</span>
                          <span>{EMPLOYMENT_TYPES[job.employmentType]}</span>
                          <span>·</span>
                          <span>{WORK_MODES[job.workMode]}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {job.identifiedRole && <IdentifiedBadge />}
                          {job.salaryRange && (
                            <span className="text-sm text-gray-500">{job.salaryRange}</span>
                          )}
                        </div>
                      </div>
                      {job.closingDate && (
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          Closes {formatDate(job.closingDate)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — enquiry form */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="font-heading text-lg font-semibold text-forest mb-4">
              Get in touch
            </h2>
            {employer.contactName && (
              <p className="text-sm text-gray-600 mb-4">
                Contact: <strong>{employer.contactName}</strong>
              </p>
            )}
            <EnquiryForm employerId={employer.id} employerName={employer.name} />
          </div>
          <div className="mt-6">
            <GroVerifiedSection groVerified={employer.groVerified} />
          </div>
          {employer.spotlightUrl && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-6">
              <h2 className="font-heading text-lg font-semibold text-forest mb-3">FNN Spotlight</h2>
              <a
                href={employer.spotlightUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline text-sm font-medium"
              >
                {employer.spotlightTitle || "Read our story on FNN"} ↗
              </a>
            </div>
          )}
        </div>
      </div>
      <TrackPageView employerId={employer.id} />
    </div>
  );
}
