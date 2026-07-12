import Link from "next/link";
import type { SeedMember } from "@/lib/seed-members";
import { AvailabilityBadge } from "./availability-badge";

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
            {/* Programlama bilgisi — skill adları düz metin, seviye yok */}
            {member.skills.length > 0 && (
              <div className="text-[0.68rem] text-text-faint truncate mt-0.5">
                {member.skills.map((s) => s.name).join(" · ")}
              </div>
            )}
          </div>
        </div>
        <AvailabilityBadge status={member.availability.status} compact />
      </div>

      {/* Alt: hackathon katılımı */}
      <div className="flex items-center justify-between pt-3 border-t border-line-soft">
        <div className="text-[13px] text-text-soft">{member.hackathonCount} hackathon</div>
        {member.bestResult && member.bestResult !== "participated" && (
          <div className="text-[0.62rem] text-ink">en iyi: {member.bestResult}</div>
        )}
      </div>
    </Link>
  );
}


