"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BridgeMark } from "@/components/layout/bridge-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // std.yildiz.edu.tr domain kontrolü
  const isValid = email.endsWith("@std.yildiz.edu.tr");
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError("Sadece @std.yildiz.edu.tr maili ile kayıt olabilirsin.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <BridgeMark className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-semibold text-text text-lg">Bridge</div>
            <div className="text-xs text-text-faint">YTÜ Blockchain</div>
          </div>
        </div>

        {sent ? (
          /* Başarı — sihirli link gönderildi */
          <div className="card p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-ink/10 grid place-items-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" className="h-6 w-6">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-text mb-2">Maillerini kontrol et</h1>
            <p className="text-sm text-text-soft leading-relaxed mb-1">
              <span className="font-medium text-text">{email}</span> adresine
              sihirli bir link gönderdik.
            </p>
            <p className="text-sm text-text-soft leading-relaxed mb-5">
              Linke tıkla, giriş yapmış olacaksın. Link 1 saat geçerli.
            </p>
            <Button
              variant="link"
              onClick={() => { setSent(false); setEmail(""); }}
            >
              <ArrowLeft />
              Farklı mail dene
            </Button>
          </div>
        ) : (
          /* Login formu */
          <div className="card p-8">
            <h1 className="text-lg font-semibold text-text mb-1">Giriş yap</h1>
            <p className="text-sm text-text-soft mb-5">
              YTÜ Blockchain topluluğuna katılmak için okul mailinle giriş yap.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs text-text-faint mb-1.5">
                  Okul mailin
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ad.soyad@std.yildiz.edu.tr"
                  required
                  className="w-full"
                />
                {email && !isValid && (
                  <Badge
                    variant="warn"
                    className="mt-1.5 h-auto whitespace-normal text-left"
                  >
                    Sadece @std.yildiz.edu.tr uzantılı mail kabul edilir.
                  </Badge>
                )}
                {email && isValid && (
                  <Badge variant="soft" className="mt-1.5">
                    ✓ Geçerli okul maili
                  </Badge>
                )}
              </div>

              {error && (
                <Badge
                  variant="warn"
                  className="w-full justify-start h-auto whitespace-normal text-left p-2.5"
                >
                  {error}
                </Badge>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading || !isValid}
                className="w-full"
              >
                {loading ? "Gönderiliyor…" : "Sihirli link gönder"}
              </Button>
            </form>

            <p className="text-[0.7rem] text-text-faint mt-5 text-center leading-relaxed">
              Şifre yok. Mailine tek kullanımlık giriş linki göndeririz.
              Link tıklayınca giriş yapmış olursun.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
