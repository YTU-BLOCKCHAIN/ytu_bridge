import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { HackathonCard } from "@/components/hackathon-card";

export default function DiscoveryPage() {
  const upcoming = DISCOVERED_HACKATHONS.filter((h) => h.status === "upcoming");
  const ongoing = DISCOVERED_HACKATHONS.filter((h) => h.status === "ongoing");
  const completed = DISCOVERED_HACKATHONS.filter((h) => h.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Keşif</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Hackathonları duruma göre gruplanmış görün: yaklaşan, devam eden ve
          tamamlanan.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Column title="Yaklaşan" count={upcoming.length} items={upcoming} />
        <Column title="Devam eden" count={ongoing.length} items={ongoing} />
        <Column title="Tamamlanan" count={completed.length} items={completed} />
      </div>
    </div>
  );
}

function Column({
  title,
  count,
  items,
}: {
  title: string;
  count: number;
  items: typeof DISCOVERED_HACKATHONS;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-sm font-medium text-text">{title}</h2>
        <span className="text-xs text-text-faint">{count}</span>
      </div>
      <div className="space-y-4">
        {items.map((h) => (
          <HackathonCard key={h.id} h={h} />
        ))}
        {items.length === 0 && (
          <div className="card p-6 text-center text-text-faint text-sm">
            Bu sütunda hackathon yok.
          </div>
        )}
      </div>
    </div>
  );
}


