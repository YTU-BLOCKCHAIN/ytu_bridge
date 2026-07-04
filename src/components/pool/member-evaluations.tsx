"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getEvaluationsForMember, RESULT_LABELS, type Evaluation } from "@/lib/evaluations";

const CHIP_TONE: Record<string, string> = {
  good: "chip-good",
  ink: "chip-ink",
  dim: "chip-dim",
};

export function MemberEvaluations({ memberId }: { memberId: string }) {
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEvals(getEvaluationsForMember(memberId));
    setLoaded(true);
  }, [memberId]);

  if (!loaded) return null;
  if (evals.length === 0) return null;

  const avgScore = Math.round(evals.reduce((s, e) => s + e.score, 0) / evals.length);
  const wins = evals.filter((e) => ["1st", "2nd", "3rd"].includes(e.result)).length;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-medium text-text">Hackathon geçmişi</h2>
        <span className="text-xs text-text-faint">{evals.length} katılım · ortalama {avgScore}</span>
      </div>
      <div className="card divide-y divide-line-soft">
        {evals.map((ev) => {
          const r = RESULT_LABELS[ev.result];
          return (
            <Link
              key={ev.id}
              href={`/hackathons/${ev.hackathonId}`}
              className="flex items-center justify-between gap-3 p-3.5 hover:bg-surface-2 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="min-w-0">
                <div className="text-sm text-text truncate">{ev.hackathonName}</div>
                <div className="text-[0.7rem] text-text-faint">
                  {new Date(ev.submittedAt).toLocaleDateString("tr-TR", { month: "short", year: "numeric" })}
                  {ev.learnedSkills.length > 0 && ` · +${ev.learnedSkills.length} skill`}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`chip ${CHIP_TONE[r.tone]} text-[0.6rem]`}>{r.label}</span>
                <span className="font-mono text-sm text-text">{ev.score}</span>
              </div>
            </Link>
          );
        })}
      </div>
      {wins > 0 && (
        <div className="text-xs text-ink mt-2">🏆 {wins} derece</div>
      )}
    </div>
  );
}
