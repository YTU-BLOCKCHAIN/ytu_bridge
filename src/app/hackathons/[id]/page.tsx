import Link from "next/link";
import { notFound } from "next/navigation";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { SEED_MEMBERS } from "@/lib/seed-members";
import { ApplyButton } from "@/components/apply-button";

export function generateStaticParams() {
  return DISCOVERED_HACKATHONS.map((h) => ({ id: h.id }));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

// Basit uygunluk önerisi: skill/track örtüşmesi olan müsait üyeler
function suggestMembers(hackathonTracks: string[]) {
  const trackToSkills: Record<string, string[]> = {
    "DeFi": ["DeFi & Tokenomics", "Solidity", "Smart Contract Development"],
    "NFT/Gaming": ["Solidity", "Next.js / React", "Game Development (on-chain)"],
    "Infra/Tooling": ["Smart Contract Development", "Backend / API Development", "DevOps & Infrastructure"],
    "ZK/Privacy": ["zk-Proofs & Cryptography", "Security & Smart Contract Auditing"],
    "AI×Web3": ["AI × Blockchain", "Data Analysis & Scripting", "Next.js / React"],
    "Public Goods": ["Solidity", "Research & Analysis", "Technical Writing & Documentation"],
    "Social/Consumer": ["UI/UX Design", "Frontend Development", "Community Management / DevRel"],
    "Other": [],
  };
  const wanted = new Set<string>();
  hackathonTracks.forEach((t) => (trackToSkills[t] ?? []).forEach((s) => wanted.add(s)));

  return SEED_MEMBERS.filter(
    (m) => m.availability.status !== "unavailable" && m.skills.some((s) => wanted.has(s.name))
  ).slice(0, 4);
}

export default function HackathonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <DetailContent params={params} />;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-text-faint mb-1">{label}</div>
      <div className="text-sm text-text">{value}</div>
    </div>
  );
}

async function DetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = DISCOVERED_HACKATHONS.find((x) => x.id === id);
  if (!h) notFound();

  const suggested = suggestMembers(h.tracks);

  return (
    <div className="space-y-6">
      <Link href="/directory" className="text-sm text-text-soft hover:text-text transition-colors">
        ← Hackathonlara dön
      </Link>

      {/* Başlık */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.65rem] ${
                h.status === "upcoming" ? "chip-good" : h.status === "ongoing" ? "chip-warn" : "chip-dim"
              }`}>
                {h.status === "upcoming" ? "Yaklaşan" : h.status === "ongoing" ? "Devam eden" : "Tamamlandı"}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-text leading-tight">{h.name}</h1>
            <div className="text-text-soft mt-1">{h.organizer}</div>
          </div>
          {h.prizePool && (
            <div className="text-right shrink-0">
              <div className="font-mono text-2xl font-semibold text-text">{h.prizePool}</div>
              <div className="text-xs text-text-faint mt-1">ödül</div>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-line-soft">
          <Meta label="Başlangıç" value={formatDate(h.dateStart)} />
          <Meta label="Bitiş" value={h.dateEnd ? formatDate(h.dateEnd) : "—"} />
          <Meta label="Konum" value={h.location} />
          <Meta label="Başvuru" value={h.applicationDeadline ? formatDate(h.applicationDeadline) : "—"} />
        </div>

        {h.externalLink && (
          <a
            href={h.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors"
          >
            Resmi siteye git <span aria-hidden>↗</span>
          </a>
        )}
      </div>

      {/* Tracks + Chains */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-medium text-text mb-3">Kategoriler</h2>
          {h.tracks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {h.tracks.map((t) => (
                <span key={t} className="chip chip-ink">{t}</span>
              ))}
            </div>
          ) : (
            <div className="text-text-faint text-sm">Belirtilmemiş</div>
          )}
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-medium text-text mb-3">Zincirler</h2>
          {h.chains.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {h.chains.map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
          ) : (
            <div className="text-text-faint text-sm">Belirtilmemiş</div>
          )}
        </div>
      </div>


      {/* Not (varsa) */}
      {h.notes && (
        <div className="card p-5">
          <h2 className="text-sm font-medium text-text mb-2">Not</h2>
          <p className="text-[14px] text-text-soft leading-relaxed">{h.notes}</p>
        </div>
      )}

      {/* Uygun üyeler */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium text-text">Bu hackathona uygun üyeler</h2>
          <span className="text-xs text-text-faint">{suggested.length} uygun</span>
        </div>
        <div className="card divide-y divide-line-soft">
          {suggested.map((m) => (
            <Link
              key={m.id}
              href={`/pool/${m.id}`}
              className="flex items-center justify-between gap-3 p-3.5 hover:bg-surface-2 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-surface-2 border border-line grid place-items-center text-xs font-semibold text-text shrink-0">
                  {m.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-text truncate">{m.fullName}</div>
                  <div className="text-[0.7rem] text-text-faint truncate">
                    {m.skills.slice(0, 2).map((s) => s.name).join(" · ")}
                  </div>
                </div>
              </div>
              <span className="font-mono text-sm text-text shrink-0">{m.internalRating}</span>
            </Link>
          ))}
          {suggested.length === 0 && (
            <div className="p-6 text-center text-text-faint text-sm">Uygun üye bulunamadı.</div>
          )}
        </div>
      </div>

      {/* Başvuru */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-text mb-2">Başvur</h2>
        <p className="text-[13px] text-text-soft leading-relaxed mb-3">
          Bu hackathona bireysel başvurabilir veya kendi joker takımını kurup
          diğer üyelere davet gönderebilirsin.
        </p>
        <ApplyButton hackathon={h} members={SEED_MEMBERS} />
      </div>
    </div>
  );
}

