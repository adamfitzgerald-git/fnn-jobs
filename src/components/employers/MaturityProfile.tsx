import type { MaturityDimensionType } from "@prisma/client";

const DIMENSION_LABELS: Record<string, { label: string; icon: string }> = {
  EMPLOYMENT: { label: "Employment", icon: "👥" },
  LEADERSHIP: { label: "Leadership", icon: "🏛" },
  CULTURAL_SAFETY: { label: "Cultural Safety", icon: "🤝" },
  SUPPLIER_DIVERSITY: { label: "Supplier Diversity", icon: "🔗" },
  COMMUNITY_ENGAGEMENT: { label: "Community Engagement", icon: "🌏" },
  RAP_ACCOUNTABILITY: { label: "RAP Accountability", icon: "📋" },
  MEASUREMENT: { label: "Measurement", icon: "📊" },
};

type Dimension = {
  dimension: MaturityDimensionType;
  summary: string | null;
  initiatives: string | null;
  evidence: string | null;
  status: string | null;
};

export function MaturityProfile({ dimensions }: { dimensions: Dimension[] }) {
  if (dimensions.length === 0) return null;

  const dimensionMap = new Map(dimensions.map(d => [d.dimension, d]));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="font-heading text-xl font-semibold text-forest mb-2">
        First Nations Engagement Profile
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        How this employer performs across key dimensions of First Nations engagement.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(DIMENSION_LABELS).map(([key, { label, icon }]) => {
          const dim = dimensionMap.get(key as MaturityDimensionType);
          const status = dim?.status;

          // Color coding: strong = green, developing = amber, incomplete/missing = gray
          const statusColor = status === "strong"
            ? "bg-teal/10 border-teal/30"
            : status === "developing"
            ? "bg-amber/10 border-amber/30"
            : "bg-gray-50 border-gray-200";

          const dotColor = status === "strong"
            ? "bg-teal"
            : status === "developing"
            ? "bg-amber"
            : "bg-gray-300";

          return (
            <div key={key} className={`rounded-lg border p-4 ${statusColor}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor} flex-shrink-0`} />
                    <h3 className="font-semibold text-sm text-forest">{label}</h3>
                  </div>
                  {dim?.summary ? (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-3">{dim.summary}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1 italic">Not yet reported</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
