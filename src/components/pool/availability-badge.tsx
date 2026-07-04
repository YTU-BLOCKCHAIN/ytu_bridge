import type { AvailabilityStatus } from "@/lib/seed-members";

const CONFIG: Record<
  AvailabilityStatus,
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  available: {
    label: "Müsait",
    dot: "bg-emerald",
    text: "text-emerald-bright",
    bg: "bg-emerald/10",
    border: "border-emerald/25",
  },
  limited: {
    label: "Sınırlı",
    dot: "bg-amber",
    text: "text-amber-bright",
    bg: "bg-amber/10",
    border: "border-amber/25",
  },
  unavailable: {
    label: "Müsait değil",
    dot: "bg-zinc-500",
    text: "text-faint",
    bg: "bg-white/5",
    border: "border-white/10",
  },
};

export function AvailabilityBadge({
  status,
  until,
  compact = false,
}: {
  status: AvailabilityStatus;
  until?: string;
  compact?: boolean;
}) {
  const c = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${c.bg} ${c.border} ${c.text} ${
        compact ? "px-2 py-0.5 text-[0.62rem]" : "px-2.5 py-1 text-xs"
      } font-mono`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${status === "available" ? "animate-pulse" : ""}`} />
      {c.label}
      {until && !compact && (
        <span className="text-faint normal-case">· {until}</span>
      )}
    </span>
  );
}
