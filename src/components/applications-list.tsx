"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getApplications,
  withdrawApplication,
  respondToInvite,
  type Application,
  type ApplicationStatus,
  type InviteStatus,
} from "@/lib/applications";

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  pending: "chip-ink",
  approved: "chip-good",
  rejected: "chip-warn",
  withdrawn: "chip-dim",
};
const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  withdrawn: "Geri çekildi",
};
const INVITE_STYLE: Record<InviteStatus, string> = {
  pending: "chip-ink",
  accepted: "chip-good",
  declined: "chip-warn",
  expired: "chip-dim",
};
const INVITE_LABEL: Record<InviteStatus, string> = {
  pending: "Beklemede",
  accepted: "Kabul",
  declined: "Red",
  expired: "Süresi doldu",
};

export function ApplicationsList() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setApps(getApplications());
    setLoaded(true);
  }, []);

  function refresh() {
    setApps(getApplications());
  }

  function handleWithdraw(id: string) {
    withdrawApplication(id);
    refresh();
  }

  function handleInviteResponse(appId: string, inviteId: string, status: InviteStatus) {
    respondToInvite(appId, inviteId, status);
    refresh();
  }

  if (!loaded) {
    return <div className="card p-8 text-center text-text-soft">Yükleniyor…</div>;
  }

  if (apps.length === 0) {
    return (
      <div className="card p-10 text-center">
        <div className="text-text-soft mb-2">Henüz başvuru yok</div>
        <p className="text-sm text-text-faint mb-4">
          Bir hackathona gidip "Başvur" de.
        </p>
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors"
        >
          Hackathonlara göz at →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apps.map((app) => (
        <div key={app.id} className="card p-5">
          {/* Üst: hackathon + durum */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <Link href={`/hackathons/${app.hackathonId}`} className="font-medium text-text hover:text-ink transition-colors">
                {app.hackathonName}
              </Link>
              <div className="text-sm text-text-soft mt-0.5">
                {app.kind === "individual" ? "Bireysel başvuru" : `Joker takım${app.teamName ? ` · ${app.teamName}` : ""}`}
              </div>
            </div>
            <span className={`chip ${STATUS_STYLE[app.status]} shrink-0`}>
              {STATUS_LABEL[app.status]}
            </span>
          </div>

          {/* Detay */}
          <div className="text-[13px] text-text-soft space-y-1 mb-3">
            {app.preferredRole && <div>Tercih edilen rol: <span className="text-text">{app.preferredRole}</span></div>}
            {app.motivation && <div className="text-text-faint italic">"{app.motivation}"</div>}
            <div className="text-text-faint">
              {new Date(app.submittedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* Takım üyeleri + davet durumu */}
          {app.teamMembers.length > 0 && (
            <div className="border-t border-line-soft pt-3">
              <div className="text-xs text-text-faint mb-2">Takım üyeleri</div>
              <div className="space-y-2">
                {app.teamMembers.map((tm) => {
                  const invite = app.invites.find((i) => i.toMemberId === tm.memberId);
                  return (
                    <div key={tm.memberId} className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-surface-2 border border-line grid place-items-center text-[0.65rem] font-semibold text-text shrink-0">
                        {tm.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <span className="text-sm text-text truncate flex-1">{tm.name}</span>
                      <span className="text-xs text-text-faint shrink-0">{tm.role}</span>
                      {invite && (
                        <span className={`chip ${INVITE_STYLE[invite.status]} text-[0.6rem] shrink-0`}>
                          {INVITE_LABEL[invite.status]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Aksiyon: geri çek */}
          {app.status === "pending" && (
            <div className="border-t border-line-soft pt-3 mt-3">
              <button
                onClick={() => handleWithdraw(app.id)}
                className="text-xs text-text-faint hover:text-warn transition-colors"
              >
                Başvuruyu geri çek
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
