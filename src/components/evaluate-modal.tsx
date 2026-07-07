"use client";

import { useState } from "react";
import { SEED_MEMBERS } from "@/lib/seed-members";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { createEvaluation, RESULT_OPTIONS, type HackathonResult } from "@/lib/evaluations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

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
      <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-ink/10 grid place-items-center mx-auto mb-4">
              <Check className="h-6 w-6 text-ink" />
            </div>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-lg">Değerlendirme kaydedildi</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-text-soft leading-relaxed mb-5">
              Sonuç havuza döndü. Üye puanı ve geçmişi güncellendi — bir sonraki
              tur daha akıllı seçim yapacak.
            </p>
            <Button size="lg" onClick={onClose}>
              Tamam
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Değerlendirme ekle</DialogTitle>
          <DialogDescription>Etkinlik sonrası — havuza dönüş</DialogDescription>
        </DialogHeader>

        {/* Hackathon + üye seçimi */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-text-faint block mb-1.5">Hackathon</Label>
            <Select value={hackathonId} onValueChange={setHackathonId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Hackathon seç" />
              </SelectTrigger>
              <SelectContent>
                {allHackathons.map((h) => (
                  <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-text-faint block mb-1.5">Üye</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Üye seç" />
              </SelectTrigger>
              <SelectContent>
                {SEED_MEMBERS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Puan slider */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <Label className="text-xs text-text-faint">Puan</Label>
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
        <div>
          <Label className="text-xs text-text-faint block mb-1.5">Sonuç</Label>
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
        <div>
          <Label className="text-xs text-text-faint block mb-1.5">Güçlü yönler</Label>
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
        <div>
          <Label className="text-xs text-text-faint block mb-1.5">Geliştirilecek yönler</Label>
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
        <div>
          <Label className="text-xs text-text-faint block mb-1.5">Öğrenilen beceriler</Label>
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
        <div>
          <Label className="text-xs text-text-faint block mb-1.5">Not (opsiyonel)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ek yorum…"
            rows={2}
            className="w-full resize-none"
          />
        </div>

        {/* Gönder */}
        <DialogFooter>
          <Button variant="outline" size="lg" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">
            Değerlendirmeyi kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
