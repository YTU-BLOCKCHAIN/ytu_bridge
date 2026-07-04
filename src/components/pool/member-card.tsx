import Link from "next/link";
import type { SeedMember } from "@/lib/seed-members";
import { AvailabilityBadge } from "./availability-badge";
import { SkillBar } from "./skill-bar";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function MemberCard({ member }: { member: SeedMember }) {
  const initials = member.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <Link href={`/pool/${member.id}`} className="card card-hover p-4 block group">
      {/* Üst: avatar + isim + müsaitlik */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-surface-2 border border-line grid place-items-center text-sm font-semibold text-text shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-text truncate">{member.fullName}</div>
            <div className="font-mono text-[0.65rem] text-text-faint truncate">
              {shortAddr(member.walletAddress)}
            </div>
          </div>
        </div>
        <AvailabilityBadge status={member.availability.status} compact />
      </div>

      {/* Skill'ler (ilk 3) */}
      <div className="space-y-1.5 mb-3">
        {member.skills.slice(0, 3).map((s) => (
          <SkillBar key={s.name} name={s.name} level={s.level} compact />
        ))}
        {member.skills.length > 3 && (
          <div className="text-[0.65rem] text-text-faint pl-1">
            +{member.skills.length - 3} daha
          </div>
        )}
      </div>

      {/* Alt: rating + geçmiş */}
      <div className="flex items-center justify-between pt-3 border-t border-line-soft">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-base font-semibold text-text">
            {member.internalRating}
          </span>
          <span className="text-[0.62rem] text-text-faint">puan</span>
        </div>
        <div className="text-right">
          <div className="text-[13px] text-text-soft">{member.hackathonCount} hackathon</div>
          {member.bestResult && member.bestResult !== "participated" && (
            <div className="text-[0.62rem] text-ink">en iyi: {member.bestResult}</div>
          )}
        </div>
      </div>
    </Link>
  );
}

