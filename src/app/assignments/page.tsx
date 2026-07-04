import { TeamBuilder } from "@/components/team/team-builder";

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Takım kur</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Müsait üyeleri sağdaki slotlara sürükle, rolleri seç. Klavye ile de
          çalışır — Tab ile odaklan, Space ile sürükle.
        </p>
      </div>

      <TeamBuilder />
    </div>
  );
}


