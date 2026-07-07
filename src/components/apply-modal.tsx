"use client";

import { useState } from "react";
import type { SeedMember } from "@/lib/seed-members";
import type { DiscoveredHackathon } from "@/lib/discovered-hackathons";
import { createApplication, getInvitableMembers, type ApplicationKind } from "@/lib/applications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";

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
      <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-ink/10 grid place-items-center mx-auto mb-4">
              <Check className="h-6 w-6 text-ink" />
            </div>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-lg">Başvuru gönderildi</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-text-soft leading-relaxed mb-5">
              {kind === "individual"
                ? `${hackathon.name} için bireysel başvurun alındı.`
                : `${hackathon.name} için takım başvurun alındı. Davet edilen ${teamMembers.length} üyeye bildirim gönderildi.`}
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
          <DialogTitle className="text-lg">Başvur</DialogTitle>
          <DialogDescription>{hackathon.name}</DialogDescription>
        </DialogHeader>

        {/* Tür seçimi */}
        <div className="mb-1">
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
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-text-faint block mb-1.5">Tercih ettiğin rol</Label>
              <Select value={preferredRole} onValueChange={setPreferredRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Rol seç" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-text-faint block mb-1.5">Motivasyon (opsiyonel)</Label>
              <Textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Neden bu hackathona katılmak istiyorsun?"
                rows={3}
                className="w-full resize-none"
              />
            </div>
          </div>
        )}


        {/* Takım: isim + üye davet */}
        {kind === "team" && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-text-faint block mb-1.5">Takım adı</Label>
              <Input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Takım adı (boş bırakırsan otomatik)"
                className="w-full"
              />
            </div>

            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-text-faint">Takım üyeleri ({teamMembers.length})</div>
                {teamMembers.map((tm) => (
                  <div key={tm.memberId} className="flex items-center gap-2 bg-surface-2 border border-line rounded-lg p-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[0.65rem] font-semibold">
                        {tm.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-text truncate flex-1">{tm.name}</span>
                    <Select value={tm.role} onValueChange={(v) => changeMemberRole(tm.memberId, v)}>
                      <SelectTrigger size="sm" className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeTeamMember(tm.memberId)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="çıkar"
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label className="text-xs text-text-faint block mb-1.5">Üye davet et</Label>
              <Input
                type="text"
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                placeholder="İsim veya skill ara…"
                className="w-full mb-2"
              />
              {inviteSearch && (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {invitable.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => addTeamMember(m)}
                      className="w-full flex items-center gap-2.5 rounded-lg p-2 hover:bg-surface-2 transition-colors text-left"
                    >
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[0.65rem] font-semibold">
                          {m.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
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
        <DialogFooter>
          <Button variant="outline" size="lg" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={kind === "team" && teamMembers.length === 0}
            className="flex-1"
          >
            {kind === "team" && teamMembers.length === 0 ? "Önce üye davet et" : "Başvuruyu gönder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
