import Link from "next/link";
import { RapBadge } from "@/components/ui/RapBadge";
import type { RapTier } from "@prisma/client";

type EmployerCardProps = {
  name: string;
  slug: string;
  logo: string | null;
  sector: string;
  headquarters: string | null;
  shortDescription: string | null;
  rapTier: RapTier;
  jobCount: number;
};

export function EmployerCard({
  name,
  slug,
  logo,
  sector,
  headquarters,
  shortDescription,
  rapTier,
  jobCount,
}: EmployerCardProps) {
  return (
    <Link
      href={`/employers/${slug}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-cream flex items-center justify-center flex-shrink-0 overflow-hidden">
            {logo ? (
              <img src={logo} alt={name} className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-2xl font-heading font-bold text-forest/40">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-semibold text-forest truncate">
              {name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">{sector}</span>
              {headquarters && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm text-gray-500">{headquarters}</span>
                </>
              )}
            </div>
            {rapTier !== "NONE" && (
              <div className="mt-2">
                <RapBadge tier={rapTier} />
              </div>
            )}
          </div>
        </div>
        {shortDescription && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {shortDescription}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {jobCount} {jobCount === 1 ? "open role" : "open roles"}
          </span>
          <span className="text-sm text-teal font-medium">View profile →</span>
        </div>
      </div>
    </Link>
  );
}
