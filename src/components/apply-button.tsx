"use client";

import { useState } from "react";
import type { SeedMember } from "@/lib/seed-members";
import type { DiscoveredHackathon } from "@/lib/discovered-hackathons";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
      <Button size="lg" onClick={() => setOpen(true)}>
        Başvur
        <ArrowRight />
      </Button>
      {open && <ApplyModal hackathon={hackathon} members={members} onClose={() => setOpen(false)} />}
    </>
  );
}
