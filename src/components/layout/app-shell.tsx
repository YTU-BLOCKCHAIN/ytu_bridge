import Link from "next/link";
import { BridgeMark } from "@/components/layout/bridge-mark";

// Üye odaklı navigasyon — yönetim dili (faz, kanal, döngü) yok.
const NAV = [
  { href: "/", label: "Ana sayfa", icon: "home" },
  { href: "/pool", label: "Topluluk", icon: "users" },
  { href: "/directory", label: "Hackathonlar", icon: "compass" },
  { href: "/projects", label: "Projeler", icon: "cube" },
  { href: "/assignments", label: "Takımlar", icon: "shuffle" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  home: <path d="M3 11 12 4l9 7M5 10v10h14V10" strokeLinejoin="round" />,
  users: (
    <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 11a3.5 3.5 0 1 0 0-7M22 21a6.5 6.5 0 0 0-5-6.3" />
  ),
  compass: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4-14-5 2-2 5 5-2 2-5Z" />,
  cube: <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 0v20M3 7l9 5 9-5" strokeLinejoin="round" />,
  shuffle: <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-surface">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-line">
          <BridgeMark className="h-7 w-7" />
          <div className="leading-tight">
            <div className="font-semibold text-text text-[15px] tracking-tight">
              Bridge
            </div>
            <div className="text-[0.68rem] text-text-faint">YTÜ Blockchain</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-2 text-text-soft hover:text-text"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[18px] w-[18px] text-text-faint group-hover:text-ink shrink-0"
                  >
                    {ICONS[item.icon]}
                  </svg>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-3 border-t border-line">
          <div className="flex items-center gap-2 text-[0.72rem] text-text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            <span>2026 dönemi</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 border-b border-line bg-canvas/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 md:hidden">
            <BridgeMark className="h-6 w-6" />
            <span className="font-semibold text-text">Bridge</span>
          </div>
          <div className="hidden md:block text-sm text-text-soft">
            Hackathon katılım platformu
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-text-soft hover:text-text border border-line rounded-md px-3 py-1.5 transition-colors hover:border-ink-soft">
              Cüzdan bağla
            </button>
            <div className="h-8 w-8 rounded-full bg-ink grid place-items-center text-surface text-xs font-semibold">
              S
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

