import { SEED_MEMBERS } from "@/lib/seed-members";
import { FilterBar } from "@/components/pool/filter-bar";

export default function PoolPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Topluluk</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Kulüp üyeleri — beceriler, müsaitlik ve geçmiş hackathon katılımları.
          Birinin profiline bak, takımına davet et.
        </p>
      </div>

      <FilterBar members={SEED_MEMBERS} />
    </div>
  );
}



