import Link from "next/link";
import { IdentifiedBadge } from "@/components/ui/IdentifiedBadge";
import { RapBadge } from "@/components/ui/RapBadge";
import { formatDate, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/utils";
import type { RapTier, EmploymentType, WorkMode } from "@prisma/client";

type JobCardProps = {
  title: string;
  slug: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  salaryRange: string | null;
  identifiedRole: boolean;
  closingDate: Date | null;
  employer: {
    name: string;
    slug: string;
    logo: string | null;
    rapTier: RapTier;
  };
};

export function JobCard({
  title,
  slug,
  location,
  workMode,
  employmentType,
  salaryRange,
  identifiedRole,
  closingDate,
  employer,
}: JobCardProps) {
  return (
    <Link
      href={`/jobs/${slug}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center flex-shrink-0 overflow-hidden">
          {employer.logo ? (
            <img src={employer.logo} alt={employer.name} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-lg font-heading font-bold text-forest/40">
              {employer.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-semibold text-forest">{title}</h3>
          <span className="text-sm text-teal">{employer.name}</span>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
            <span>{location}</span>
            <span className="text-gray-300">·</span>
            <span>{WORK_MODES[workMode]}</span>
            <span className="text-gray-300">·</span>
            <span>{EMPLOYMENT_TYPES[employmentType]}</span>
            {salaryRange && (
              <>
                <span className="text-gray-300">·</span>
                <span>{salaryRange}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {identifiedRole && <IdentifiedBadge />}
            {employer.rapTier !== "NONE" && <RapBadge tier={employer.rapTier} />}
          </div>
        </div>
        {closingDate && (
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            Closes {formatDate(closingDate)}
          </span>
        )}
      </div>
    </Link>
  );
}
