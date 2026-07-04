import { EvaluationsList } from "@/components/evaluations-list";

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Değerlendirmeler</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Hackathon sonrası değerlendirmeler. Puan, güçlü ve geliştirilecek
          yönler, sonuç ve öğrenilen beceriler havuza döner — bir sonraki tur
          daha akıllı seçim yapar.
        </p>
      </div>

      <EvaluationsList />
    </div>
  );
}


