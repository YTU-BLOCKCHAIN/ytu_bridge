"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BridgeMark } from "@/components/layout/bridge-mark";

const SKILL_CATALOG = [
  "Solidity", "Smart Contract Development", "Next.js / React", "TypeScript",
  "Rust", "Anchor", "Move", "Cairo", "Python", "UI/UX Design",
  "DeFi & Tokenomics", "zk-Proofs & Cryptography", "Security & Smart Contract Auditing",
  "Project Management", "Pitching & Presentation", "Research & Analysis",
  "Community Management / DevRel", "Technical Writing & Documentation",
  "Backend / API Development", "DevOps & Infrastructure", "Game Development (on-chain)",
];

const AVAILABILITY = [
  { value: "available", label: "Müsait", desc: "Şu an katılabilir" },
  { value: "limited", label: "Sınırlı", desc: "Bazı tarihlerde" },
  { value: "unavailable", label: "Değil", desc: "Şu an katılamaz" },
] as const;

export default function ProfileSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>("available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
      setFullName(user.email?.split("@")[0].replace(/[._]/g, " ") || "");
    });
  }, []);

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error: memberError } = await supabase.from("members").upsert({
      id: user.id, full_name: fullName, student_email: email,
      email_verified: true, wallet_address: `0x${user.id.replace(/-/g, "").slice(0, 40)}`,
      wallet_verified: false, availability_status: availability, role: "member",
    });
    if (memberError) { setError(memberError.message); setLoading(false); return; }

    await supabase.from("member_skills").delete().eq("member_id", user.id);
    if (selectedSkills.length > 0) {
      const { error: skillError } = await supabase.from("member_skills").insert(
        selectedSkills.map((name) => ({ member_id: user.id, skill_name: name, level: 3 }))
      );
      if (skillError) { setError(skillError.message); setLoading(false); return; }
    }
    setLoading(false);
    router.push("/pool");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <BridgeMark className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-semibold text-text text-lg">Bridge</div>
            <div className="text-xs text-text-faint">YTÜ Blockchain</div>
          </div>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-text mb-1">Profilini oluştur</h1>
          <p className="text-sm text-text-soft mb-5">
            Topluluğa katılmak için profilini doldur. Bunlar diğer üyelere görünür.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Ad Soyad</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ad Soyad" required className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-faint outline-none focus:border-ink-soft" />
            </div>
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Email</label>
              <input type="email" value={email} disabled className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2.5 text-sm text-text-faint outline-none" />
            </div>
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Programlama bilgisi ({selectedSkills.length} seçili)</label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {SKILL_CATALOG.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)} className={`text-xs rounded-lg border px-2.5 py-1.5 transition-colors ${selectedSkills.includes(s) ? "border-ink bg-ink/5 text-text" : "border-line text-text-soft hover:border-ink-soft"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Müsaitlik durumu</label>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABILITY.map((a) => (
                  <button key={a.value} type="button" onClick={() => setAvailability(a.value)} className={`text-left rounded-lg border p-2.5 transition-colors ${availability === a.value ? "border-ink bg-ink/5" : "border-line hover:border-ink-soft"}`}>
                    <div className="text-sm font-medium text-text">{a.label}</div>
                    <div className="text-[0.62rem] text-text-faint mt-0.5">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {error && <div className="text-xs text-warn bg-warn/8 border border-warn/20 rounded-lg p-2.5">{error}</div>}
            <button type="submit" disabled={loading || !fullName} className="w-full rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors disabled:opacity-40">{loading ? "Kaydediliyor…" : "Profilini kaydet ve katıl"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

