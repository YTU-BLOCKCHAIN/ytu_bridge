"use client";

import { useState } from "react";
import { SEED_MEMBERS } from "@/lib/seed-members";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { createEvaluation, RESULT_OPTIONS, type HackathonResult } from "@/lib/evaluations";

const COMMON_STRENGTHS = [
  "Hızlı prototip",
  "Sağlam mimari",
  "İyi pitch",
  "Takım uyumu",
  "Yaratıcı çözüm",
  "İyi dokümantasyon",
  "Çalışan demo",
];

const COMMON_IMPROVEMENTS = [
  "Daha iyi pitch",
  "Daha çok test",
  "UI/UX iyileştirme",
  "Daha odaklı kapsam",
  "Daha iyi dokümantasyon",
  "Takım iletişimi",
];

const LEARNABLE_SKILLS = [
  "Solidity",
  "Next.js / React",
  "wagmi / viem",
  "Anchor",
  "zk-Proofs",
  "UI/UX Design",
  "Pitching",
];

export function EvaluateModal({ onClose }: { onClose: () => void }) {
  const completed = DISCOVERED_HACKATHONS.filter((h) => h.status === "completed");
  const allHackathons = DISCOVERED_HACKATHONS;
  const [hackathonId, setHackathonId] = useState(completed[0]?.id ?? allHackathons[0]?.id ?? "");
  const [memberId, setMemberId] = useState(SEED_MEMBERS[0]?.id ?? "");
  const [score, setScore] = useState(75);
  const [result, setResult] = useState<HackathonResult>("participated");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [learnedSkills, setLearnedSkills] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function handleSubmit() {
    const hackathon = allHackathons.find((h) => h.id === hackathonId);
    const member = SEED_MEMBERS.find((m) => m.id === memberId);
    if (!hackathon || !member) return;
    createEvaluation({
      hackathonId: hackathon.id,
      hackathonName: hackathon.name,
      memberId: member.id,
      memberName: member.fullName,
      score,
      strengths,
      improvements,
      result,
      learnedSkills,
      notes: notes || undefined,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
        <div className="card p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-ink/10 grid place-items-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" className="h-6 w-6">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Değerlendirme kaydedildi</h3>
            <p className="text-sm text-text-soft leading-relaxed mb-5">
              Sonuç havuza döndü. Üye puanı ve geçmişi güncellendi — bir sonraki
              tur daha akıllı seçim yapacak.
            </p>
            <button
              onClick={onClose}
              className="rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="card p-6 max-w-lg w-full my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-text">Değerlendirme ekle</h3>
            <p className="text-sm text-text-soft mt-0.5">Etkinlik sonrası — havuza dönüş</p>
          </div>
          <button onClick={onClose} className="text-text-faint hover:text-text transition-colors" aria-label="kapat">✕</button>
        </div>

        {/* Hackathon + üye seçimi */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-text-faint block mb-1.5">Hackathon</label>
            <select
              value={hackathonId}
              onChange={(e) => setHackathonId(e.target.value)}
              className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft"
            >
              {allHackathons.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-faint block mb-1.5">Üye</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft"
            >
              {SEED_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>{m.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Puan slider */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <label className="text-xs text-text-faint">Puan</label>
            <span className="font-mono text-lg font-semibold text-text">{score}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-ink"
          />
        </div>

        {/* Sonuç */}
        <div className="mb-4">
          <label className="text-xs text-text-faint block mb-1.5">Sonuç</label>
          <div className="flex flex-wrap gap-1.5">
            {RESULT_OPTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setResult(r.value)}
                className={`text-xs rounded-lg border px-2.5 py-1.5 transition-colors ${
                  result === r.value ? "border-ink bg-ink/5 text-text" : "border-line text-text-soft hover:border-ink-soft"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>


        {/* Güçlü yönler */}
        <div className="mb-4">
          <label className="text-xs text-text-faint block mb-1.5">Güçlü yönler</label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_STRENGTHS.map((s) => (
              <button
                key={s}
                onClick={() => toggle(strengths, setStrengths, s)}
                className={`text-xs rounded-lg border px-2.5 py-1.5 transition-colors ${
                  strengths.includes(s) ? "border-ink bg-ink/5 text-text" : "border-line text-text-soft hover:border-ink-soft"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Geliştirilecek yönler */}
        <div className="mb-4">
          <label className="text-xs text-text-faint block mb-1.5">Geliştirilecek yönler</label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_IMPROVEMENTS.map((s) => (
              <button
                key={s}
                onClick={() => toggle(improvements, setImprovements, s)}
                className={`text-xs rounded-lg border px-2.5 py-1.5 transition-colors ${
                  improvements.includes(s) ? "border-warn bg-warn/5 text-text" : "border-line text-text-soft hover:border-ink-soft"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Öğrenilen skill'ler */}
        <div className="mb-4">
          <label className="text-xs text-text-faint block mb-1.5">Öğrenilen beceriler</label>
          <div className="flex flex-wrap gap-1.5">
            {LEARNABLE_SKILLS.map((s) => (
              <button
                key={s}
                onClick={() => toggle(learnedSkills, setLearnedSkills, s)}
                className={`text-xs rounded-lg border px-2.5 py-1.5 transition-colors ${
                  learnedSkills.includes(s) ? "border-ink bg-ink/5 text-text" : "border-line text-text-soft hover:border-ink-soft"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Notlar */}
        <div className="mb-5">
          <label className="text-xs text-text-faint block mb-1.5">Not (opsiyonel)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ek yorum…"
            rows={2}
            className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft resize-none"
          />
        </div>

        {/* Gönder */}
        <div className="flex gap-2 pt-2 border-t border-line-soft">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-line text-text-soft font-medium text-sm px-4 py-2.5 hover:border-ink-soft transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors"
          >
            Değerlendirmeyi kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

