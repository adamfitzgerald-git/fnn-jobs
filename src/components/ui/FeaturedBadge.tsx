export function FeaturedBadge({ size = "sm" }: { size?: "sm" | "lg" }) {
  const sizeClasses =
    size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold bg-teal text-white ${sizeClasses}`}
    >
      <svg
        className={size === "lg" ? "w-4 h-4" : "w-3 h-3"}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      Featured
    </span>
  );
}
