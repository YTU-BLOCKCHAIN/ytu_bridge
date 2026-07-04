// ============================================================================
// Değerlendirmeler — VERİ KAYNAĞI (client-side, localStorage)
// ============================================================================
// Faz 6: Etkinlik sonrası değerlendirme → havuza dönüş.
// Puan + güçlü/zayıf yönler + sonuç + öğrenilen skill'ler.
// Supabase bağlanana kadar localStorage'da tutulur.
// ============================================================================

export type HackathonResult =
  | "1st"
  | "2nd"
  | "3rd"
  | "top10"
  | "finalist"
  | "participated"
  | "no-show";

export interface Evaluation {
  id: string;
  hackathonId: string;
  hackathonName: string;
  memberId: string;
  memberName: string;
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  result: HackathonResult;
  learnedSkills: string[];
  notes?: string;
  submittedAt: string; // ISO
}

const STORAGE_KEY = "bridge-evaluations";

function load(): Evaluation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Evaluation[]) : [];
  } catch {
    return [];
  }
}

function save(evals: Evaluation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(evals));
}

export function getEvaluations(): Evaluation[] {
  return load().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getEvaluationsForMember(memberId: string): Evaluation[] {
  return load().filter((e) => e.memberId === memberId);
}

export function getEvaluationsForHackathon(hackathonId: string): Evaluation[] {
  return load().filter((e) => e.hackathonId === hackathonId);
}

export function createEvaluation(
  ev: Omit<Evaluation, "id" | "submittedAt">
): Evaluation {
  const newEval: Evaluation = {
    ...ev,
    id: `eval-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  const all = load();
  all.push(newEval);
  save(all);
  return newEval;
}

export function deleteEvaluation(id: string) {
  const all = load();
  save(all.filter((e) => e.id !== id));
}

// Sonuç etiketleri + sıralama (ödül ağırlığı)
export const RESULT_LABELS: Record<HackathonResult, { label: string; tone: "good" | "ink" | "dim" }> = {
  "1st": { label: "1. lik", tone: "good" },
  "2nd": { label: "2. lik", tone: "good" },
  "3rd": { label: "3. lük", tone: "good" },
  "top10": { label: "Top 10", tone: "ink" },
  "finalist": { label: "Finalist", tone: "ink" },
  "participated": { label: "Katıldı", tone: "dim" },
  "no-show": { label: "Gelmedi", tone: "dim" },
};

export const RESULT_OPTIONS: { value: HackathonResult; label: string }[] = [
  { value: "1st", label: "1. lik" },
  { value: "2nd", label: "2. lik" },
  { value: "3rd", label: "3. lük" },
  { value: "top10", label: "Top 10" },
  { value: "finalist", label: "Finalist" },
  { value: "participated", label: "Katıldı" },
  { value: "no-show", label: "Gelmedi" },
];
