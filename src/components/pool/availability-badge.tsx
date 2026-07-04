import type { AvailabilityStatus } from "@/lib/seed-members";

const CONFIG: Record<
  AvailabilityStatus,
  { label: string; chip: string; dot: string }
> = {
  available: { label: "Müsait", chip: "chip-good", dot: "bg-ink" },
  limited: { label: "Sınırlı", chip: "chip-warn", dot: "bg-warn" },
  unavailable: { label: "Müsait değil", chip: "chip-dim", dot: "bg-dim" },
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
    <span className={`inline-flex items-center gap-1.5 ${c.chip} ${compact ? "px-2 py-0.5 text-[0.65rem]" : "px-2.5 py-1 text-xs"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
      {until && !compact && <span className="text-text-faint">· {until}</span>}
    </span>
  );
}

