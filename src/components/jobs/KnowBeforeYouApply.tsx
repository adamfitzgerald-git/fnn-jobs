import type { MaturityDimensionType } from "@prisma/client";

type Dimension = {
  dimension: MaturityDimensionType;
  summary: string | null;
  status: string | null;
};

export function KnowBeforeYouApply({ dimensions, rapTier }: { dimensions: Dimension[]; rapTier: string }) {
  if (dimensions.length === 0) return null;

  const dimMap = new Map(dimensions.map(d => [d.dimension, d]));

  const items: { label: string; value: string; status: string }[] = [];

  const employment = dimMap.get("EMPLOYMENT");
  if (employment?.summary) items.push({ label: "Indigenous Employment", value: employment.summary.slice(0, 80), status: employment.status || "incomplete" });

  const cultural = dimMap.get("CULTURAL_SAFETY");
  if (cultural?.summary) items.push({ label: "Cultural Safety", value: cultural.summary.slice(0, 80), status: cultural.status || "incomplete" });

  const community = dimMap.get("COMMUNITY_ENGAGEMENT");
  if (community?.summary) items.push({ label: "Community Engagement", value: community.summary.slice(0, 80), status: community.status || "incomplete" });

  if (rapTier !== "NONE") {
    items.push({ label: "RAP Status", value: rapTier.charAt(0) + rapTier.slice(1).toLowerCase(), status: "strong" });
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-cream/50 rounded-lg border border-amber/20 p-4">
      <h3 className="font-heading text-sm font-semibold text-forest mb-3">Know Before You Apply</h3>
      <div className="space-y-2">
        {items.slice(0, 4).map((item) => {
          const dot = item.status === "strong" ? "bg-teal" : item.status === "developing" ? "bg-amber" : "bg-gray-300";
          return (
            <div key={item.label} className="flex items-start gap-2">
              <span className={`w-2 h-2 rounded-full ${dot} mt-1.5 flex-shrink-0`} />
              <div>
                <span className="text-xs font-medium text-forest">{item.label}</span>
                <p className="text-xs text-gray-600 line-clamp-1">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
