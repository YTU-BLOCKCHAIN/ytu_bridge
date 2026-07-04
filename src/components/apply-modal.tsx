"use client";

import { useState } from "react";
import type { SeedMember } from "@/lib/seed-members";
import type { DiscoveredHackathon } from "@/lib/discovered-hackathons";
import { createApplication, getInvitableMembers, type ApplicationKind } from "@/lib/applications";

const ROLES = [
  "Smart Contract Dev",
  "Frontend Dev",
  "Backend Dev",
  "UI/UX Designer",
  "Project Manager",
  "Pitch / Presentation",
  "Research",
];

export function ApplyModal({
  hackathon,
  members,
  onClose,
}: {
  hackathon: DiscoveredHackathon;
  members: SeedMember[];
  onClose: () => void;
}) {
  const [kind, setKind] = useState<ApplicationKind>("individual");
  const [preferredRole, setPreferredRole] = useState(ROLES[0]);
  const [motivation, setMotivation] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<
    { memberId: string; name: string; role: string }[]
  >([]);
  const [inviteSearch, setInviteSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const invitable = getInvitableMembers(
    members,
    teamMembers.map((tm) => tm.memberId)
  ).filter((m) =>
    inviteSearch
      ? m.fullName.toLowerCase().includes(inviteSearch.toLowerCase()) ||
        m.skills.some((s) => s.name.toLowerCase().includes(inviteSearch.toLowerCase()))
      : true
  );

  function addTeamMember(member: SeedMember) {
    setTeamMembers((prev) => [
      ...prev,
      { memberId: member.id, name: member.fullName, role: ROLES[0] },
    ]);
    setInviteSearch("");
  }

  function removeTeamMember(memberId: string) {
    setTeamMembers((prev) => prev.filter((tm) => tm.memberId !== memberId));
  }

  function changeMemberRole(memberId: string, role: string) {
    setTeamMembers((prev) =>
      prev.map((tm) => (tm.memberId === memberId ? { ...tm, role } : tm))
    );
  }

  function handleSubmit() {
    createApplication({
      hackathonId: hackathon.id,
      hackathonName: hackathon.name,
      applicantName: "Sen",
      kind,
      preferredRole: kind === "individual" ? preferredRole : undefined,
      motivation: motivation || undefined,
      teamName: kind === "team" ? teamName || `${hackathon.name} takımı` : undefined,
      teamMembers: kind === "team" ? teamMembers : [],
      invites:
        kind === "team"
          ? teamMembers.map((tm) => ({
              id: `inv-${Date.now()}-${tm.memberId}`,
              toMemberId: tm.memberId,
              toMemberName: tm.name,
              proposedRole: tm.role,
              status: "pending" as const,
            }))
          : [],
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
            <h3 className="text-lg font-semibold text-text mb-2">Başvuru gönderildi</h3>
            <p className="text-sm text-text-soft leading-relaxed mb-5">
              {kind === "individual"
                ? `${hackathon.name} için bireysel başvurun alındı.`
                : `${hackathon.name} için takım başvurun alındı. Davet edilen ${teamMembers.length} üyeye bildirim gönderildi.`}
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
            <h3 className="text-lg font-semibold text-text">Başvur</h3>
            <p className="text-sm text-text-soft mt-0.5">{hackathon.name}</p>
          </div>
          <button onClick={onClose} className="text-text-faint hover:text-text transition-colors" aria-label="kapat">✕</button>
        </div>

        {/* Tür seçimi */}
        <div className="mb-5">
          <div className="text-xs text-text-faint mb-2">Başvuru türü</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setKind("individual")}
              className={`rounded-lg border p-3 text-left transition-colors ${
                kind === "individual" ? "border-ink bg-ink/5" : "border-line hover:border-ink-soft"
              }`}
            >
              <div className="text-sm font-medium text-text">Bireysel</div>
              <div className="text-xs text-text-soft mt-0.5">Tek başına katıl</div>
            </button>
            <button
              onClick={() => setKind("team")}
              className={`rounded-lg border p-3 text-left transition-colors ${
                kind === "team" ? "border-ink bg-ink/5" : "border-line hover:border-ink-soft"
              }`}
            >
              <div className="text-sm font-medium text-text">Joker takım</div>
              <div className="text-xs text-text-soft mt-0.5">Kendi takımını kur</div>
            </button>
          </div>
        </div>

        {/* Bireysel: rol + motivasyon */}
        {kind === "individual" && (
          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Tercih ettiğin rol</label>
              <select
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft"
              >
                {ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Motivasyon (opsiyonel)</label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Neden bu hackathona katılmak istiyorsun?"
                rows={3}
                className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft resize-none"
              />
            </div>
          </div>
        )}


        {/* Takım: isim + üye davet */}
        {kind === "team" && (
          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs text-text-faint block mb-1.5">Takım adı</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Takım adı (boş bırakırsan otomatik)"
                className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft"
              />
            </div>

            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-text-faint">Takım üyeleri ({teamMembers.length})</div>
                {teamMembers.map((tm) => (
                  <div key={tm.memberId} className="flex items-center gap-2 bg-surface-2 border border-line rounded-lg p-2.5">
                    <div className="h-7 w-7 rounded-full bg-surface border border-line grid place-items-center text-[0.65rem] font-semibold text-text shrink-0">
                      {tm.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <span className="text-sm text-text truncate flex-1">{tm.name}</span>
                    <select
                      value={tm.role}
                      onChange={(e) => changeMemberRole(tm.memberId, e.target.value)}
                      className="text-xs bg-surface border border-line rounded px-2 py-1 text-text-soft outline-none"
                    >
                      {ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
                    </select>
                    <button onClick={() => removeTeamMember(tm.memberId)} className="text-text-faint hover:text-warn text-xs" aria-label="çıkar">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-xs text-text-faint block mb-1.5">Üye davet et</label>
              <input
                type="text"
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                placeholder="İsim veya skill ara…"
                className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft mb-2"
              />
              {inviteSearch && (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {invitable.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => addTeamMember(m)}
                      className="w-full flex items-center gap-2.5 rounded-lg p-2 hover:bg-surface-2 transition-colors text-left"
                    >
                      <div className="h-7 w-7 rounded-full bg-surface-2 border border-line grid place-items-center text-[0.65rem] font-semibold text-text shrink-0">
                        {m.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-text truncate">{m.fullName}</div>
                        <div className="text-[0.65rem] text-text-faint truncate">
                          {m.skills.slice(0, 2).map((s) => s.name).join(" · ")}
                        </div>
                      </div>
                      <span className="text-xs text-ink shrink-0">+ davet et</span>
                    </button>
                  ))}
                  {invitable.length === 0 && (
                    <div className="text-xs text-text-faint p-2">Uygun üye yok.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

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
            disabled={kind === "team" && teamMembers.length === 0}
            className="flex-1 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {kind === "team" && teamMembers.length === 0 ? "Önce üye davet et" : "Başvuruyu gönder"}
          </button>
        </div>
      </div>
    </div>
  );
}

