"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function AdminPanel() {
  const supabase = createClient();
  const [emails, setEmails] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function loadEmails() {
    const { data } = await supabase.from("allowed_emails").select("id, email, created_at").order("created_at", { ascending: false });
    setEmails(data || []);
  }

  useEffect(() => { loadEmails(); }, []);

  async function addEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail) return;
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.from("allowed_emails").insert({ email: newEmail.toLowerCase().trim() });
    setLoading(false);
    if (error) {
      setMsg(error.code === "23505" ? "Bu mail zaten listede." : error.message);
    } else {
      setMsg("✓ Eklendi");
      setNewEmail("");
      loadEmails();
    }
  }

  async function removeEmail(id: string) {
    await supabase.from("allowed_emails").delete().eq("id", id);
    loadEmails();
  }

  async function bulkAdd(text: string) {
    const list = text.split(/[\n,\s]+/).map((e) => e.toLowerCase().trim()).filter(Boolean);
    if (list.length === 0) return;
    setLoading(true);
    const { error } = await supabase.from("allowed_emails").insert(list.map((email) => ({ email })));
    setLoading(false);
    if (error) {
      setMsg("Bazı mailler zaten listede olabilir.");
    } else {
      setMsg(`✓ ${list.length} mail eklendi`);
    }
    loadEmails();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Üye yönetimi</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Kulüp üyelerinin maillerini buraya ekle. Sadece listedeki maillerle kayıt olunabilir.
        </p>
      </div>

      {/* Tek mail ekle */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-text mb-3">Mail ekle</h2>
        <form onSubmit={addEmail} className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="uye@mail.com"
            required
            className="flex-1 bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-faint outline-none focus:border-ink-soft"
          />
          <button type="submit" disabled={loading} className="rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2 hover:bg-ink-bright transition-colors disabled:opacity-40">
            Ekle
          </button>
        </form>
        {msg && <div className="text-xs text-text-soft mt-2">{msg}</div>}
      </div>

      {/* Toplu ekle */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-text mb-2">Toplu ekle</h2>
        <p className="text-xs text-text-faint mb-3">Mail adreslerini virgül veya boşlukla ayır, yapıştır.</p>
        <textarea
          placeholder="ali@mail.com, ayse@mail.com, veli@mail.com"
          rows={3}
          className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-faint outline-none focus:border-ink-soft resize-none mb-2"
          onBlur={(e) => { if (e.target.value) { bulkAdd(e.target.value); e.target.value = ""; } }}
        />
      </div>

      {/* Mevcut liste */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium text-text">Onaylı mailler</h2>
          <span className="text-xs text-text-faint">{emails.length} üye</span>
        </div>
        <div className="card divide-y divide-line-soft">
          {emails.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 first:rounded-t-xl last:rounded-b-xl">
              <span className="text-sm text-text truncate">{e.email}</span>
              <button onClick={() => removeEmail(e.id)} className="text-xs text-text-faint hover:text-warn transition-colors shrink-0">Sil</button>
            </div>
          ))}
          {emails.length === 0 && (
            <div className="p-6 text-center text-text-faint text-sm">Henüz mail eklenmemiş.</div>
          )}
        </div>
      </div>
    </div>
  );
}
