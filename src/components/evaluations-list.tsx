"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getEvaluations,
  deleteEvaluation,
  RESULT_LABELS,
  type Evaluation,
} from "@/lib/evaluations";
import { EvaluateModal } from "./evaluate-modal";

const CHIP_TONE: Record<string, "soft" | "dim"> = {
  good: "soft",
  ink: "soft",
  dim: "dim",
};

export function EvaluationsList() {
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setEvals(getEvaluations());
    setLoaded(true);
  }, []);

  function refresh() {
    setEvals(getEvaluations());
  }

  function handleDelete(id: string) {
    deleteEvaluation(id);
    refresh();
  }

  if (!loaded) {
    return <div className="card p-8 text-center text-text-soft">Yükleniyor…</div>;
  }

  return (
    <div className="space-y-4">
      {/* Yeni değerlendirme butonu */}
      <div className="flex justify-end">
        <Button size="lg" onClick={() => setShowModal(true)}>
          <Plus /> Değerlendirme ekle
        </Button>
      </div>

      {evals.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-text-soft mb-2">Henüz değerlendirme yok</div>
          <p className="text-sm text-text-faint">
            Bir hackathon bittiğinde katılan üyeleri değerlendir — sonuçlar
            havuza döner ve bir sonraki tur daha akıllı seçim yapar.
          </p>
        </div>
      ) : (
        evals.map((ev) => {
          const r = RESULT_LABELS[ev.result];
          return (
            <div key={ev.id} className="card p-5">
              {/* Üst: hackathon + üye + sonuç */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <Link
                    href={`/hackathons/${ev.hackathonId}`}
                    className="font-medium text-text hover:text-ink transition-colors"
                  >
                    {ev.hackathonName}
                  </Link>
                  <div className="text-sm text-text-soft mt-0.5">
                    <Link href={`/pool/${ev.memberId}`} className="hover:text-ink transition-colors">
                      {ev.memberName}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={CHIP_TONE[r.tone]}>{r.label}</Badge>
                  <span className="font-mono text-lg font-semibold text-text">{ev.score}</span>
                </div>
              </div>

              {/* Güçlü + geliştirilecek yönler */}
              {(ev.strengths.length > 0 || ev.improvements.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  {ev.strengths.length > 0 && (
                    <div>
                      <div className="text-xs text-text-faint mb-1.5">Güçlü yönler</div>
                      <div className="flex flex-wrap gap-1.5">
                        {ev.strengths.map((s) => (
                          <Badge key={s} variant="soft" className="text-[0.65rem]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {ev.improvements.length > 0 && (
                    <div>
                      <div className="text-xs text-text-faint mb-1.5">Geliştirilecek</div>
                      <div className="flex flex-wrap gap-1.5">
                        {ev.improvements.map((s) => (
                          <Badge key={s} variant="warn" className="text-[0.65rem]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Öğrenilen skill'ler */}
              {ev.learnedSkills.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-text-faint mb-1.5">Öğrenilen beceriler</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ev.learnedSkills.map((s) => (
                      <Badge key={s} variant="soft" className="text-[0.65rem]">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Not + alt */}
              <div className="flex items-center justify-between pt-3 border-t border-line-soft">
                <div className="text-[0.7rem] text-text-faint">
                  {new Date(ev.submittedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  {ev.notes && <span className="italic"> · "{ev.notes}"</span>}
                </div>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="text-xs text-text-faint hover:text-warn transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          );
        })
      )}

      {showModal && <EvaluateModal onClose={() => { setShowModal(false); refresh(); }} />}
    </div>
  );
}
