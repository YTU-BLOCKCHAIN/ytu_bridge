import { Badge } from "@/components/ui/badge";

// İskelet sayfası — henüz geliştirilmemiş bölümler için tutarlı yer tutucu.
export function PhaseStage({
  title,
  desc,
  soon,
  children,
}: {
  phase?: string;
  title: string;
  desc: string;
  soon?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">{desc}</p>
      </div>

      <div className="card p-12 min-h-[280px] flex flex-col items-center justify-center text-center">
        <div className="text-text-faint mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
            <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <div className="text-lg font-medium text-text-soft">{title}</div>
        <div className="text-sm text-text-faint mt-2 max-w-md leading-relaxed">{desc}</div>
        {soon && (
          <Badge variant="dim" className="mt-5">
            {soon}
          </Badge>
        )}
      </div>

      {children}
    </div>
  );
}

