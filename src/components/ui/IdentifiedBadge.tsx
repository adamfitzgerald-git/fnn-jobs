export function IdentifiedBadge({ size = "sm" }: { size?: "sm" | "lg" }) {
  const sizeClasses =
    size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold bg-amber text-white ${sizeClasses}`}
    >
      <svg
        className={size === "lg" ? "w-4 h-4" : "w-3 h-3"}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
      Identified Role
    </span>
  );
}
