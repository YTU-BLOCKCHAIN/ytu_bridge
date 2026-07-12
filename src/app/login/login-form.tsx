"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BridgeMark } from "@/components/layout/bridge-mark";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep("code");
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/profile-setup");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <BridgeMark className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-semibold text-text text-lg">Bridge</div>
            <div className="text-xs text-text-faint">YTÜ Blockchain</div>
          </div>
        </div>

        <div className="card p-8">
          {step === "email" ? (
            <>
              <h1 className="text-lg font-semibold text-text mb-1">Kayıt ol / Giriş yap</h1>
              <p className="text-sm text-text-soft mb-5">
                Mailini gir, sana 6 haneli bir kod gönderelim.
              </p>
              <form onSubmit={sendCode} className="space-y-4">
                <div>
                  <label className="text-xs text-text-faint block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ad.soyad@std.yildiz.edu.tr"
                    required
                    className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-faint outline-none focus:border-ink-soft"
                  />
                </div>
                {error && (
                  <div className="text-xs text-warn bg-warn/8 border border-warn/20 rounded-lg p-2.5">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors disabled:opacity-40"
                >
                  {loading ? "Gönderiliyor…" : "Kod gönder"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-text mb-1">Kodunu gir</h1>
              <p className="text-sm text-text-soft mb-5">
                <span className="font-medium text-text">{email}</span> adresine 6 haneli kod gönderdik.
              </p>
              <form onSubmit={verifyCode} className="space-y-4">
                <div>
                  <label className="text-xs text-text-faint block mb-1.5">6 haneli kod</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    required
                    className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2.5 text-center text-lg font-mono tracking-[0.5em] text-text placeholder:text-text-faint outline-none focus:border-ink-soft"
                  />
                </div>
                {error && (
                  <div className="text-xs text-warn bg-warn/8 border border-warn/20 rounded-lg p-2.5">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors disabled:opacity-40"
                >
                  {loading ? "Doğrulanıyor…" : "Doğrula ve gir"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setCode(""); setError(null); }}
                  className="w-full text-sm text-text-faint hover:text-text transition-colors"
                >
                  ← Farklı mail
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
