type RapProgressEntry = {
  id: string;
  year: number;
  targetSet: string | null;
  achieved: string | null;
  initiatives: string | null;
  targetMet: string;
  externalLink: string | null;
  nextYearTarget: string | null;
};

const STATUS_CONFIG: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
  MET: {
    label: "Met",
    dotClass: "bg-green-500",
    badgeClass: "bg-green-100 text-green-800",
  },
  PARTIALLY_MET: {
    label: "Partially met",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  NOT_MET: {
    label: "Not met",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-100 text-red-800",
  },
  IN_PROGRESS: {
    label: "In progress",
    dotClass: "bg-gray-400",
    badgeClass: "bg-gray-100 text-gray-700",
  },
};

export function RapTimeline({ entries }: { entries: RapProgressEntry[] }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="font-heading text-xl font-semibold text-forest mb-6">
        RAP Progress
      </h2>
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />

        <div className="space-y-8">
          {entries.map((entry) => {
            const config = STATUS_CONFIG[entry.targetMet] || STATUS_CONFIG.IN_PROGRESS;

            return (
              <div key={entry.id} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-2 ring-white ${config.dotClass}`}
                />

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading text-lg font-bold text-forest">
                      {entry.year}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {entry.targetSet && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Targets set</p>
                      <p className="text-sm text-gray-600">{entry.targetSet}</p>
                    </div>
                  )}

                  {entry.achieved && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Achieved</p>
                      <p className="text-sm text-gray-600">{entry.achieved}</p>
                    </div>
                  )}

                  {entry.initiatives && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Key initiatives</p>
                      <p className="text-sm text-gray-600">{entry.initiatives}</p>
                    </div>
                  )}

                  {entry.externalLink && (
                    <a
                      href={entry.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      View evidence / annual report ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
