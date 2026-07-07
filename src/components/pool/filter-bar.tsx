"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { SeedMember, AvailabilityStatus } from "@/lib/seed-members";
import { MemberCard } from "./member-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="İsim, skill, tag ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8"
          />
        </div>

        <Select value={skill} onValueChange={setSkill}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Tüm skill'ler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm skill&apos;ler</SelectItem>
            {allSkills.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 bg-surface-2 border border-line rounded-md p-0.5">
          {AVAILABILITY_OPTIONS.map((o) => (
            <Button
              key={o.value}
              onClick={() => setAvailability(o.value)}
              size="xs"
              variant={availability === o.value ? "default" : "ghost"}
            >
              {o.label}
            </Button>
          ))}
        </div>

        <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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


