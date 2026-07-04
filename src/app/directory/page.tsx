import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { HackathonCard } from "@/components/hackathon-card";

export default function DirectoryPage() {
  const upcoming = DISCOVERED_HACKATHONS.filter((h) => h.status === "upcoming");
  const others = DISCOVERED_HACKATHONS.filter((h) => h.status !== "upcoming");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Hackathonlar</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Yaklaşan ve geçmiş hackathonlar. Birine tıkla, detayları ve uygun
          projeleri gör.
        </p>
      </div>

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-text-soft mb-3">Yaklaşan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((h) => (
              <HackathonCard key={h.id} h={h} />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-text-soft mb-3 mt-8">Geçmiş</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((h) => (
              <HackathonCard key={h.id} h={h} />
            ))}
          </div>
        </div>
      )}

      {DISCOVERED_HACKATHONS.length === 0 && (
        <div className="card p-10 text-center text-text-soft">
          Henüz hackathon yok.
        </div>
      )}
    </div>
  );
}


