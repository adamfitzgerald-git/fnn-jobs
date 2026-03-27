import { RapTier } from "@prisma/client";

const RAP_CONFIG: Record<RapTier, { label: string; bg: string; text: string }> = {
  NONE: { label: "", bg: "", text: "" },
  REFLECT: { label: "Reflect", bg: "bg-[#8A9B96]", text: "text-white" },
  INNOVATE: { label: "Innovate", bg: "bg-[#1D9E75]", text: "text-white" },
  STRETCH: { label: "Stretch", bg: "bg-[#C98A2F]", text: "text-white" },
  ELEVATE: { label: "Elevate", bg: "bg-[#0F6E56]", text: "text-white" },
};

export function RapBadge({
  tier,
  size = "sm",
}: {
  tier: RapTier;
  size?: "sm" | "lg";
}) {
  if (tier === "NONE") return null;

  const config = RAP_CONFIG[tier];
  const sizeClasses =
    size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <svg
        className={size === "lg" ? "w-4 h-4" : "w-3 h-3"}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      RAP — {config.label}
    </span>
  );
}
