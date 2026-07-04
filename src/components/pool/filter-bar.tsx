"use client";

import { useState, useMemo } from "react";
import type { SeedMember, AvailabilityStatus } from "@/lib/seed-members";
import { MemberCard } from "./member-card";

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "available", label: "Müsait" },
  { value: "limited", label: "Sınırlı" },
  { value: "unavailable", label: "Değil" },
];

const SORT_OPTIONS = [
  { value: "rating", label: "Puana göre" },
  { value: "availability", label: "Müsaitlik" },
  { value: "name", label: "İsim (A-Z)" },
  { value: "experience", label: "Tecrübe" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function FilterBar({ members }: { members: SeedMember[] }) {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityStatus | "all">("all");
  const [sort, setSort] = useState<SortValue>("rating");

  const allSkills = useMemo(() => {
    const s = new Set<string>();
    members.forEach((m) => m.skills.forEach((sk) => s.add(sk.name)));
    return Array.from(s).sort();
  }, [members]);

  const filtered = useMemo(() => {
    let result = members.filter((m) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !m.fullName.toLowerCase().includes(q) &&
          !m.tags.some((t) => t.toLowerCase().includes(q)) &&
          !m.skills.some((s) => s.name.toLowerCase().includes(q))
        )
          return false;
      }
      if (skill !== "all" && !m.skills.some((s) => s.name === skill)) return false;
      if (availability !== "all" && m.availability.status !== availability) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "rating") return b.internalRating - a.internalRating;
      if (sort === "name") return a.fullName.localeCompare(b.fullName, "tr");
      if (sort === "experience") return b.hackathonCount - a.hackathonCount;
      if (sort === "availability") {
        const order: Record<AvailabilityStatus, number> = { available: 0, limited: 1, unavailable: 2 };
        return order[a.availability.status] - order[b.availability.status];
      }
      return 0;
    });
    return result;
  }, [members, query, skill, availability, sort]);

  return (
    <div className="space-y-4">
      {/* Filtre satırı */}
      <div className="card p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-text-faint">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="İsim, skill, tag ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm text-text placeholder:text-text-faint outline-none flex-1 min-w-0"
          />
        </div>

        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="bg-surface-2 border border-line rounded-md text-xs text-text-soft px-2.5 py-1.5 outline-none focus:border-ink-soft"
        >
          <option value="all">Tüm skill'ler</option>
          {allSkills.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center gap-1 bg-surface-2 border border-line rounded-md p-0.5">
          {AVAILABILITY_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setAvailability(o.value)}
              className={`text-[0.68rem] px-2 py-1 rounded transition-colors ${
                availability === o.value ? "bg-ink text-surface" : "text-text-faint hover:text-text-soft"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          className="bg-surface-2 border border-line rounded-md text-xs text-text-soft px-2.5 py-1.5 outline-none focus:border-ink-soft"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-text-soft">
        {filtered.length} / {members.length} üye
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
        {filtered.length === 0 && (
          <div className="card p-10 text-center text-text-soft text-sm col-span-full">
            Filtreye uyan üye yok. Filtreleri gevşetmeyi dene.
          </div>
        )}
      </div>
    </div>
  );
}


