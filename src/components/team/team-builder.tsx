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
import { SEED_MEMBERS, type SeedMember } from "@/lib/seed-members";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";

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
        <div className="h-8 w-8 rounded-full bg-surface-2 border border-line grid place-items-center text-xs font-semibold text-text shrink-0">
          {initials}
        </div>
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
        <select
          value={slot.role}
          onChange={(e) => onRoleChange(e.target.value as Role)}
          className="text-xs bg-surface-2 border border-line rounded px-2 py-1 text-text-soft outline-none focus:border-ink-soft"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {member && (
          <button
            onClick={onRemove}
            className="text-text-faint hover:text-warn text-xs transition-colors"
            aria-label="üyeyi çıkar"
          >
            çıkar ✕
          </button>
        )}
      </div>
      {member ? (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-surface-2 border border-line grid place-items-center text-xs font-semibold text-text shrink-0">
            {member.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
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
            <label className="text-xs text-text-faint block mb-1.5">Hackathon</label>
            <select
              value={selectedHackathon}
              onChange={(e) => {
                setSelectedHackathon(e.target.value);
                const h = upcoming.find((hh) => hh.id === e.target.value);
                const size = h?.idealTeamSize ?? 4;
                setSlots(Array.from({ length: size }, (_, i) => ({ memberId: null, role: ROLES[i % ROLES.length] as Role })));
              }}
              className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-ink-soft"
            >
              {upcoming.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
              {upcoming.length === 0 && <option value="">Hackathon yok</option>}
            </select>
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
            <button
              disabled={filledSlots.length === 0}
              className="w-full mt-4 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {filledSlots.length === teamSize ? "Takımı kaydet" : `Takımı kaydet (${filledSlots.length}/${teamSize})`}
            </button>
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
              <div className="h-8 w-8 rounded-full bg-surface-2 border border-line grid place-items-center text-xs font-semibold text-text">
                {activeMember.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="text-sm font-medium text-text">{activeMember.fullName}</div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

