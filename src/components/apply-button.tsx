"use client";

import { useState } from "react";
import type { SeedMember } from "@/lib/seed-members";
import type { DiscoveredHackathon } from "@/lib/discovered-hackathons";
import { ApplyModal } from "./apply-modal";

export function ApplyButton({
  hackathon,
  members,
}: {
  hackathon: DiscoveredHackathon;
  members: SeedMember[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-ink text-surface font-medium text-sm px-4 py-2.5 hover:bg-ink-bright transition-colors"
      >
        Başvur
        <span aria-hidden>→</span>
      </button>
      {open && <ApplyModal hackathon={hackathon} members={members} onClose={() => setOpen(false)} />}
    </>
  );
}
