import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { DiscoveredHackathon } from "@/lib/discovered-hackathons";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function dateRange(start: string, end?: string): string {
  if (!end || end === start) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString("tr-TR", { day: "numeric" })}–${e.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function HackathonCard({ h }: { h: DiscoveredHackathon }) {
  return (
    <Link href={`/hackathons/${h.id}`} className="card card-hover p-5 block group flex flex-col h-full">
      {/* Üst: durum */}
      <div className="flex items-center gap-2 mb-3">
        <Badge
          variant={h.status === "upcoming" ? "soft" : h.status === "ongoing" ? "warn" : "dim"}
          className="gap-1.5 text-[0.65rem]"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${
            h.status === "upcoming" ? "bg-ink" : h.status === "ongoing" ? "bg-warn" : "bg-dim"
          }`} />
          {h.status === "upcoming" ? "Yaklaşan" : h.status === "ongoing" ? "Devam eden" : "Tamamlandı"}
        </Badge>
      </div>

      <h3 className="font-medium text-text leading-tight group-hover:text-ink transition-colors">
        {h.name}
      </h3>
      <div className="text-sm text-text-soft mt-0.5">{h.organizer}</div>

      {/* Tarih + konum */}
      <div className="flex items-center gap-3 mt-3 text-[13px] text-text-faint">
        <span className="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
          </svg>
          {dateRange(h.dateStart, h.dateEnd)}
        </span>
        <span className="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
            <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {h.location}
        </span>
      </div>

      {/* Tracks */}
      {h.tracks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {h.tracks.map((t) => (
            <Badge key={t} variant="soft">{t}</Badge>
          ))}
        </div>
      )}

      {/* Alt: zincir + ödül */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-line-soft">
        <div className="flex items-center gap-1.5 flex-wrap">
          {h.chains.slice(0, 3).map((c) => (
            <span key={c} className="text-[0.7rem] text-text-faint">{c}</span>
          ))}
          {h.chains.length > 3 && <span className="text-[0.7rem] text-text-faint">+{h.chains.length - 3}</span>}
        </div>
        {h.prizePool && <span className="font-mono text-sm text-text">{h.prizePool}</span>}
      </div>
    </Link>
  );
}

