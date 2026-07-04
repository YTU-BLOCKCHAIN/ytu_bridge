import Link from "next/link";
import type { SeedMember } from "@/lib/seed-members";
import { AvailabilityBadge } from "./availability-badge";
import { SkillBar } from "./skill-bar";

// Cüzdan adresini kısalt: 0x1234…abcd
function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// Rating renk skalası
function ratingColor(r: number) {
  if (r >= 90) return "text-emerald-bright";
  if (r >= 80) return "text-emerald";
  if (r >= 70) return "text-amber-bright";
  return "text-faint";
}

export function MemberCard({ member }: { member: SeedMember }) {
  const initials = member.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <Link
      href={`/pool/${member.id}`}
      className="glass rounded-xl p-4 card-lift block group"
    >
      {/* Üst: avatar + isim + müsaitlik */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`h-10 w-10 rounded-full grid place-items-center text-sm font-semibold shrink-0 ${
              member.role === "admin"
                ? "bg-gradient-to-br from-emerald to-emerald-dim text-ink"
                : "bg-white/8 text-fog border border-line"
            }`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-fog text-[15px] truncate">
                {member.fullName}
              </span>
              {member.role === "admin" && (
                <span className="text-[0.58rem] font-mono text-emerald-bright border border-emerald/30 rounded px-1 py-px shrink-0">
                  ADM
                </span>
              )}
            </div>
            <div className="font-mono text-[0.65rem] text-faint truncate">
              {shortAddr(member.walletAddress)}
            </div>
          </div>
        </div>
        <AvailabilityBadge status={member.availability.status} compact />
      </div>

      {/* Skill'ler (ilk 3, kompakt) */}
      <div className="space-y-1.5 mb-3">
        {member.skills.slice(0, 3).map((s) => (
          <SkillBar key={s.name} name={s.name} level={s.level} compact />
        ))}
        {member.skills.length > 3 && (
          <div className="text-[0.65rem] font-mono text-faint pl-1">
            +{member.skills.length - 3} daha
          </div>
        )}
      </div>

      {/* Alt: rating + geçmiş */}
      <div className="flex items-center justify-between pt-3 border-t border-line">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono text-lg font-semibold ${ratingColor(member.internalRating)}`}>
            {member.internalRating}
          </span>
          <span className="text-[0.62rem] text-faint font-mono">rating</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-mist">{member.hackathonCount} hackathon</div>
          {member.bestResult && member.bestResult !== "participated" && (
            <div className="text-[0.62rem] font-mono text-amber-bright">
              en iyi: {member.bestResult}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {member.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {member.tags.map((t) => (
            <span key={t} className="skill-pill">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
