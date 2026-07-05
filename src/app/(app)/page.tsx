import Link from "next/link";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { SEED_MEMBERS } from "@/lib/seed-members";
import { BridgeMark } from "@/components/layout/bridge-mark";

export default function Home() {
  const upcoming = DISCOVERED_HACKATHONS.filter((h) => h.status === "upcoming");
  const availableMembers = SEED_MEMBERS.filter((m) => m.availability.status === "available").length;

  return (
    <div className="space-y-10">
      {/* Hero — sade, yaz odaklı */}
      <section className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <BridgeMark className="h-5 w-5" />
          <span className="text-sm text-text-soft">YTÜ Blockchain Topluluğu</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-text leading-[1.1] max-w-2xl">
          Hackathonları keşfet, takımını kur, yarış.
        </h1>
        <p className="text-text-soft mt-4 text-[16px] max-w-xl leading-relaxed">
          Topluluk üyelerini, mevcut projeleri ve yaklaşan hackathonları tek
          yerden gör. Uygun olanı bul, başvur veya kendi takımını kur.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors"
          >
            Hackathonları gör
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/pool"
            className="inline-flex items-center gap-2 rounded-lg border border-line text-text font-medium text-sm px-4 py-2.5 hover:border-ink-soft transition-colors"
          >
            Topluluğu gör
          </Link>
        </div>
      </section>

      {/* Özet rakamlar — sade, tek satır */}
      <section className="grid grid-cols-3 gap-4 border-y border-line py-6">
        <Stat value={String(SEED_MEMBERS.length)} label="topluluk üyesi" />
        <Stat value={String(upcoming.length)} label="yaklaşan hackathon" />
        <Stat value={String(availableMembers)} label="şu an müsait" />
      </section>

      {/* Yaklaşan hackathonlar */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Yaklaşan hackathonlar</h2>
          <Link href="/directory" className="text-sm text-ink hover:underline">
            Tümünü gör →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {upcoming.map((h) => (
            <Link key={h.id} href={`/hackathons/${h.id}`} className="card card-hover p-5 block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-text truncate">{h.name}</div>
                  <div className="text-sm text-text-soft mt-0.5">{h.organizer}</div>
                </div>
                {h.prizePool && (
                  <span className="font-mono text-sm text-text shrink-0">{h.prizePool}</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3 text-[13px] text-text-faint">
                <span>{new Date(h.dateStart).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
                <span>·</span>
                <span>{h.location}</span>
              </div>
              {h.tracks.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {h.tracks.slice(0, 3).map((t) => (
                    <span key={t} className="chip chip-ink">{t}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
          {upcoming.length === 0 && (
            <div className="card p-8 text-center text-text-soft col-span-full">
              Şu an yaklaşan hackathon yok.
            </div>
          )}
        </div>
      </section>

      {/* Topluluktan birkaç üye */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Topluluktan birkaç kişi</h2>
          <Link href="/pool" className="text-sm text-ink hover:underline">
            Hepsini gör →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEED_MEMBERS.slice(0, 3).map((m) => (
            <Link key={m.id} href={`/pool/${m.id}`} className="card card-hover p-4 block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-2 border border-line grid place-items-center text-sm font-semibold text-text shrink-0">
                  {m.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-text truncate">{m.fullName}</div>
                  <div className="text-[13px] text-text-soft truncate">
                    {m.skills.slice(0, 2).map((s) => s.name).join(" · ")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-text">{value}</div>
      <div className="text-sm text-text-soft mt-0.5">{label}</div>
    </div>
  );
}
