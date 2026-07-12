"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserMenu({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-lg hover:bg-surface-2 transition-colors px-2 py-1">
        <div className="h-8 w-8 rounded-full bg-ink grid place-items-center text-surface text-xs font-semibold">{initials}</div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-40 card p-3 w-56">
            <div className="px-2 py-1.5 mb-1">
              <div className="text-sm font-medium text-text truncate">{name}</div>
              <div className="text-xs text-text-faint truncate">{email}</div>
            </div>
            <button onClick={handleLogout} className="w-full text-left text-sm text-text-soft hover:text-warn hover:bg-surface-2 rounded-lg px-2 py-1.5 transition-colors">Çıkış yap</button>
          </div>
        </>
      )}
    </div>
  );
}
