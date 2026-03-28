export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isClosingDatePassed(date: Date | string | null): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

export function daysUntilClose(date: Date | string | null): number | null {
  if (!date) return null;
  const closing = new Date(date);
  const now = new Date();
  const diff = Math.ceil((closing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

export const SECTORS = [
  "Resources",
  "Finance",
  "Health",
  "Government",
  "Construction",
  "Education",
  "Technology",
  "Other",
] as const;

export const RAP_TIERS = {
  NONE: { label: "No RAP", color: "bg-gray-100 text-gray-600" },
  REFLECT: { label: "Reflect", color: "bg-[#8A9B96] text-white" },
  INNOVATE: { label: "Innovate", color: "bg-[#1D9E75] text-white" },
  STRETCH: { label: "Stretch", color: "bg-[#C98A2F] text-white" },
  ELEVATE: { label: "Elevate", color: "bg-[#0F6E56] text-white" },
} as const;

export const EMPLOYMENT_TYPES = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  CASUAL: "Casual",
} as const;

export const WORK_MODES = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
} as const;
