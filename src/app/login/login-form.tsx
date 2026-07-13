"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BridgeMark } from "@/components/layout/bridge-mark";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      // Kayıt — hesap oluştur
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      if (data.user) {
        router.push("/profile-setup");
        router.refresh();
      }
    } else {
      // Giriş — mevcut hesapla
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/");
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
          {/* Sekme: Kayıt / Giriş */}
          <div className="flex gap-1 mb-5 bg-surface-2 rounded-lg p-1">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 text-sm font-medium rounded-md py-2 transition-colors ${mode === "login" ? "bg-ink text-surface" : "text-text-soft hover:text-text"}`}
            >
              Giriş yap
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 text-sm font-medium rounded-md py-2 transition-colors ${mode === "signup" ? "bg-ink text-surface" : "text-text-soft hover:text-text"}`}
            >
              Kayıt ol
            </button>
          </div>

          <h1 className="text-lg font-semibold text-text mb-1">
            {mode === "login" ? "Giriş yap" : "Hesap oluştur"}
          </h1>
          <p className="text-sm text-text-soft mb-5">
            {mode === "login"
              ? "Email ve şifrenle gir."
              : "Email ve şifre belirle, sonra profilini doldur."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "En az 6 karakter" : "Şifren"}
                required
                minLength={6}
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
              {loading ? "Bekle…" : mode === "login" ? "Giriş yap" : "Kayıt ol"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

