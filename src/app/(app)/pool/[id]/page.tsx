import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_MEMBERS } from "@/lib/seed-members";
import { AvailabilityBadge } from "@/components/pool/availability-badge";
import { MemberCard } from "@/components/pool/member-card";
import { MemberEvaluations } from "@/components/pool/member-evaluations";

export function generateStaticParams() {
  return SEED_MEMBERS.map((m) => ({ id: m.id }));
}

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <DetailContent params={params} />;
}

async function DetailContent({ params }: { params: Promise<{ id: string }> }) {
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
      <Link href="/pool" className="text-sm text-text-soft hover:text-text transition-colors">
        ← Topluluğa dön
      </Link>

      {/* Profil başlığı */}
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="h-16 w-16 rounded-2xl bg-surface-2 border border-line grid place-items-center text-xl font-semibold text-text shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-text">{member.fullName}</h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <AvailabilityBadge status={member.availability.status} until={member.availability.until} />
            </div>
            {member.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {member.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-4">
        {/* Programlama bilgisi — skill adları, seviye yok */}
        <div className="card p-5">
          <h2 className="text-sm font-medium text-text mb-4">Programlama bilgisi</h2>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((s) => (
              <span key={s.name} className="chip chip-ink">{s.name}</span>
            ))}
            {member.skills.length === 0 && (
              <span className="text-sm text-text-faint">Belirtilmemiş</span>
            )}
          </div>
        </div>

        {/* Özet */}
        <div className="card p-5 space-y-4">
          <h2 className="text-sm font-medium text-text">Özet</h2>
          <Stat label="Hackathon katılımı" value={String(member.hackathonCount)} />
          <Stat
            label="En iyi sonuç"
            value={member.bestResult ?? "—"}
            highlight={Boolean(member.bestResult && member.bestResult !== "participated")}
          />
        </div>
      </div>

      {/* Diğer üyeler — takım kurmak için */}
      <MemberEvaluations memberId={member.id} />

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium text-text">Topluluktan diğerleri</h2>
          <span className="text-xs text-text-faint">takımına davet etmek için</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div className="flex items-center justify-between gap-3 border-b border-line-soft pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-text-faint">{label}</span>
      <span
        className={`text-sm ${mono ? "font-mono text-[0.72rem]" : ""} ${
          highlight ? "text-ink font-medium" : "text-text"
        } text-right truncate max-w-[60%]`}
      >
        {value}
      </span>
    </div>
  );
}

