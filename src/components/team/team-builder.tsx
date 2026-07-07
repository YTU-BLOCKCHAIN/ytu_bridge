"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { SEED_MEMBERS, type SeedMember } from "@/lib/seed-members";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = [
  "Smart Contract Dev",
  "Frontend Dev",
  "Backend Dev",
  "UI/UX Designer",
  "Project Manager",
  "Pitch / Presentation",
  "Research",
] as const;

type Role = (typeof ROLES)[number];

interface Slot {
  memberId: string | null;
  role: Role;
}

// Sürüklenebilir üye kartı
function DraggableMember({ member }: { member: SeedMember }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: member.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };
  const initials = member.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`card p-3 cursor-grab active:cursor-grabbing touch-none select-none card-hover ${
        isDragging ? "ring-2 ring-ink" : ""
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-text truncate">{member.fullName}</div>
          <div className="text-[0.68rem] text-text-faint truncate">
            {member.skills.slice(0, 2).map((s) => s.name).join(" · ")}
          </div>
        </div>
        <span className="font-mono text-xs text-text-soft shrink-0">{member.internalRating}</span>
      </div>
    </div>
  );
}

// Boş/dolu takım slotu (drop target)
function TeamSlot({
  slot,
  index,
  member,
  onRemove,
  onRoleChange,
}: {
  slot: Slot;
  index: number;
  member: SeedMember | null;
  onRemove: () => void;
  onRoleChange: (role: Role) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 border-dashed p-3 min-h-[72px] transition-colors ${
        isOver ? "border-ink bg-ink/5" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Select value={slot.role} onValueChange={(v) => onRoleChange(v as Role)}>
          <SelectTrigger size="sm" className="text-text-soft">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {member && (
          <Button
            onClick={onRemove}
            variant="ghost"
            size="xs"
            className="text-muted-foreground hover:text-destructive"
            aria-label="üyeyi çıkar"
          >
            çıkar
            <X />
          </Button>
        )}
      </div>
      {member ? (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {member.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-medium text-text truncate">{member.fullName}</div>
            <div className="text-[0.68rem] text-text-faint truncate">
              {member.skills.slice(0, 2).map((s) => s.name).join(" · ")}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-text-faint text-xs text-center py-3">
          {isOver ? "Bırak" : "Üye sürükle"}
        </div>
      )}
    </div>
  );
}


export function TeamBuilder() {
  const upcoming = DISCOVERED_HACKATHONS.filter((h) => h.status === "upcoming");
  const [selectedHackathon, setSelectedHackathon] = useState(upcoming[0]?.id ?? "");
  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: 4 }, (_, i) => ({
      memberId: null,
      role: ROLES[i % ROLES.length] as Role,
    }))
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {}),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const hackathon = upcoming.find((h) => h.id === selectedHackathon);
  const teamSize = hackathon?.idealTeamSize ?? 4;

  const availableMembers = useMemo(
    () =>
      SEED_MEMBERS.filter(
        (m) => m.availability.status !== "unavailable" && !slots.some((s) => s.memberId === m.id)
      ),
    [slots]
  );

  const activeMember = activeId ? SEED_MEMBERS.find((m) => m.id === activeId) ?? null : null;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const memberId = String(active.id);
    const slotMatch = String(over.id).match(/^slot-(\d+)$/);
    if (!slotMatch) return;
    const slotIndex = Number(slotMatch[1]);
    setSlots((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((s) => s.memberId === memberId);
      if (fromIndex >= 0) next[fromIndex] = { ...next[fromIndex], memberId: null };
      next[slotIndex] = { ...next[slotIndex], memberId };
      return next;
    });
  }

  function removeMember(slotIndex: number) {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = { ...next[slotIndex], memberId: null };
      return next;
    });
  }

  function changeRole(slotIndex: number, role: Role) {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = { ...next[slotIndex], role };
      return next;
    });
  }

  const filledSlots = slots.filter((s) => s.memberId);
  const teamRating = filledSlots.reduce((sum, s) => {
    const m = SEED_MEMBERS.find((mm) => mm.id === s.memberId);
    return sum + (m?.internalRating ?? 0);
  }, 0);
  const avgRating = filledSlots.length > 0 ? Math.round(teamRating / filledSlots.length) : 0;


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
        {/* Sol: müsait üye havuzu */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-medium text-text">Müsait üyeler</h2>
            <span className="text-xs text-text-faint">{availableMembers.length} kişi</span>
          </div>
          <div className="space-y-2">
            {availableMembers.map((m) => (
              <DraggableMember key={m.id} member={m} />
            ))}
            {availableMembers.length === 0 && (
              <div className="card p-6 text-center text-text-faint text-sm">
                Tüm müsait üyeler takımda.
              </div>
            )}
          </div>
        </div>

        {/* Sağ: takım slotları */}
        <div>
          <div className="mb-4">
            <Label className="text-xs text-text-faint mb-1.5">Hackathon</Label>
            <Select
              value={selectedHackathon}
              onValueChange={(value) => {
                setSelectedHackathon(value);
                const h = upcoming.find((hh) => hh.id === value);
                const size = h?.idealTeamSize ?? 4;
                setSlots(Array.from({ length: size }, (_, i) => ({ memberId: null, role: ROLES[i % ROLES.length] as Role })));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Hackathon yok" />
              </SelectTrigger>
              <SelectContent>
                {upcoming.map((h) => (
                  <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-medium text-text">Takım · {teamSize} kişi</h2>
            <span className="text-xs text-text-faint">{filledSlots.length}/{teamSize} dolu</span>
          </div>

          <div className="space-y-3">
            {slots.map((slot, i) => {
              const member = slot.memberId ? SEED_MEMBERS.find((m) => m.id === slot.memberId) ?? null : null;
              return (
                <TeamSlot
                  key={i}
                  slot={slot}
                  index={i}
                  member={member}
                  onRemove={() => removeMember(i)}
                  onRoleChange={(role) => changeRole(i, role)}
                />
              );
            })}
          </div>

          {/* Takım özeti */}
          <div className="mt-5 card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text">Takım özeti</h3>
              {filledSlots.length > 0 && (
                <span className="font-mono text-sm text-text">ortalama {avgRating}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <div className="text-text-faint text-xs">Dolu slot</div>
                <div className="text-text">{filledSlots.length}/{teamSize}</div>
              </div>
              <div>
                <div className="text-text-faint text-xs">Toplam puan</div>
                <div className="text-text">{teamRating}</div>
              </div>
            </div>
            <Button
              disabled={filledSlots.length === 0}
              size="lg"
              className="w-full mt-4"
            >
              {filledSlots.length === teamSize ? "Takımı kaydet" : `Takımı kaydet (${filledSlots.length}/${teamSize})`}
            </Button>
            <p className="text-[0.7rem] text-text-faint mt-2 text-center">
              Kayıt akışı yakında — şu an takım kurmayı test edebilirsin.
            </p>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeMember ? (
          <div className="card p-3 shadow-lg ring-2 ring-ink">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {activeMember.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium text-text">{activeMember.fullName}</div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

