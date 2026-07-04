import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_MEMBERS } from "@/lib/seed-members";
import { AvailabilityBadge } from "@/components/pool/availability-badge";
import { SkillBar } from "@/components/pool/skill-bar";
import { MemberCard } from "@/components/pool/member-card";

export function generateStaticParams() {
  return SEED_MEMBERS.map((m) => ({ id: m.id }));
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

function ratingColor(r: number) {
  if (r >= 90) return "text-emerald-bright";
  if (r >= 80) return "text-emerald";
  if (r >= 70) return "text-amber-bright";
  return "text-faint";
}

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 16 async params
  // (generateStaticParams ile statik, ama tip Promise)
  return <DetailContent params={params} />;
}

async function DetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = SEED_MEMBERS.find((m) => m.id === id);
  if (!member) notFound();

  const others = SEED_MEMBERS.filter((m) => m.id !== member.id).slice(0, 4);
  const initials = member.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6">
      {/* Geri link */}
      <Link
        href="/pool"
        className="inline-flex items-center gap-1.5 text-sm text-faint hover:text-mist transition-colors"
      >
        <span aria-hidden>←</span> Havuza dön
      </Link>

      {/* Profil başlığı */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div
            className={`h-16 w-16 rounded-2xl grid place-items-center text-xl font-semibold shrink-0 ${
              member.role === "admin"
                ? "bg-gradient-to-br from-emerald to-emerald-dim text-ink"
                : "bg-white/8 text-fog border border-line"
            }`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-semibold text-fog">
                {member.fullName}
              </h1>
              {member.role === "admin" && (
                <span className="text-[0.6rem] font-mono text-emerald-bright border border-emerald/30 rounded px-1.5 py-0.5">
                  YÖNETİM
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="font-mono text-xs text-faint">
                {shortAddr(member.walletAddress)}
              </span>
              <AvailabilityBadge status={member.availability.status} until={member.availability.until} />
            </div>
            {member.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {member.tags.map((t) => (
                  <span key={t} className="skill-pill">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Rating büyük */}
          <div className="text-right shrink-0">
            <div className={`font-mono text-4xl font-bold ${ratingColor(member.internalRating)}`}>
              {member.internalRating}
            </div>
            <div className="eyebrow mt-1">iç puan</div>
          </div>
        </div>
      </div>

      {/* İki kolon: skill + istatistik */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* Skill'ler */}
        <div className="glass rounded-xl p-5">
          <div className="eyebrow mb-4">Beceriler · {member.skills.length}</div>
          <div className="space-y-2.5">
            {member.skills.map((s) => (
              <SkillBar key={s.name} name={s.name} level={s.level} />
            ))}
          </div>
        </div>

        {/* İstatistik */}
        <div className="glass rounded-xl p-5 space-y-4">
          <div className="eyebrow">Özet</div>
          <Stat label="Hackathon katılımı" value={String(member.hackathonCount)} />
          <Stat
            label="En iyi sonuç"
            value={member.bestResult ?? "—"}
            highlight={Boolean(member.bestResult && member.bestResult !== "participated")}
          />
          <Stat label="Rol" value={member.role === "admin" ? "Yönetim" : "Üye"} />
          <Stat label="Email" value={member.studentEmail} mono />
        </div>
      </div>

      {/* Joker takım: diğer üyeler (Kanal 2) */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <div className="eyebrow">Havuzdaki diğer üyeler · joker davet</div>
          <span className="text-[0.7rem] font-mono text-faint">Kanal 2</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {others.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-faint">{label}</span>
      <span
        className={`text-sm ${mono ? "font-mono text-[0.72rem]" : ""} ${
          highlight ? "text-amber-bright font-mono" : "text-fog"
        } text-right truncate max-w-[60%]`}
      >
        {value}
      </span>
    </div>
  );
}
