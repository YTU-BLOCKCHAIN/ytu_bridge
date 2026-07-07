import type { AvailabilityStatus } from "@/lib/seed-members";
import { Badge } from "@/components/ui/badge";

const CONFIG: Record<
  AvailabilityStatus,
  { label: string; variant: "soft" | "warn" | "dim"; dot: string }
> = {
  available: { label: "Müsait", variant: "soft", dot: "bg-ink" },
  limited: { label: "Sınırlı", variant: "warn", dot: "bg-warn" },
  unavailable: { label: "Müsait değil", variant: "dim", dot: "bg-dim" },
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
    <Badge variant={c.variant} className={compact ? "text-[0.65rem]" : "text-xs"}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
      {until && !compact && <span className="text-text-faint">· {until}</span>}
    </Badge>
  );
}
