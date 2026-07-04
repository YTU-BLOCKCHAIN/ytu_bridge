import { SEED_MEMBERS } from "@/lib/seed-members";
import { FilterBar } from "@/components/pool/filter-bar";

export default function PoolPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow mb-2">Döngü · aşama 01</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-fog">
          Yetenek Havuzu
        </h1>
        <p className="text-mist mt-2 max-w-2xl leading-relaxed text-[15px]">
          Üye profilleri: skill (seviye 1–5), müsaitlik, geçmiş katılımlar ve
          projeler. Üyeler diğerlerinin tam profilini görüp joker takıma davet
          eder; admin filtrelerle havuzu tarar.
        </p>
      </div>

      <FilterBar members={SEED_MEMBERS} />
    </div>
  );
}


