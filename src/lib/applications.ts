// ============================================================================
// Başvurular & Davetler — VERİ KAYNAĞI (client-side, localStorage)
// ============================================================================
// Kanal 2: bireysel başvuru + joker takım daveti.
// Supabase bağlanana kadar localStorage'da tutulur (üye kendi tarayıcısında).
// Gerçek auth gelince server-side'e taşınır.
// ============================================================================

import type { SeedMember } from "./seed-members";

export type ApplicationStatus = "pending" | "approved" | "rejected" | "withdrawn";
export type InviteStatus = "pending" | "accepted" | "declined" | "expired";
export type ApplicationKind = "individual" | "team";

export interface TeamInvite {
  id: string;
  toMemberId: string;
  toMemberName: string;
  proposedRole: string;
  status: InviteStatus;
  message?: string;
}

export interface Application {
  id: string;
  hackathonId: string;
  hackathonName: string;
  applicantName: string; // başvuran üye (şimdilik "Sen")
  kind: ApplicationKind;
  preferredRole?: string;
  motivation?: string;
  teamName?: string;
  teamMembers: { memberId: string; name: string; role: string }[];
  invites: TeamInvite[];
  status: ApplicationStatus;
  submittedAt: string; // ISO
}

const STORAGE_KEY = "bridge-applications";

function load(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Application[]) : [];
  } catch {
    return [];
  }
}

function save(apps: Application[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

export function getApplications(): Application[] {
  return load();
}

export function getApplicationsForHackathon(hackathonId: string): Application[] {
  return load().filter((a) => a.hackathonId === hackathonId);
}

export function createApplication(app: Omit<Application, "id" | "submittedAt" | "status">): Application {
  const newApp: Application = {
    ...app,
    id: `app-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  const apps = load();
  apps.push(newApp);
  save(apps);
  return newApp;
}

export function withdrawApplication(id: string) {
  const apps = load();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx >= 0) {
    apps[idx] = { ...apps[idx], status: "withdrawn" };
    save(apps);
  }
}

export function respondToInvite(appId: string, inviteId: string, status: InviteStatus) {
  const apps = load();
  const app = apps.find((a) => a.id === appId);
  if (!app) return;
  const invite = app.invites.find((i) => i.id === inviteId);
  if (!invite) return;
  invite.status = status;
  save(apps);
}

// Davet için aday üyeler (müsait + kendin dışında)
export function getInvitableMembers(
  allMembers: SeedMember[],
  excludeIds: string[]
): SeedMember[] {
  return allMembers.filter(
    (m) => m.availability.status !== "unavailable" && !excludeIds.includes(m.id)
  );
}
