import { Badge } from "@/components/ui/badge";
import type { SeedProject, ProjectStatus } from "@/lib/seed-projects";

const STATUS_LABELS: Record<ProjectStatus, { label: string; variant: "soft" | "dim" }> = {
  "working-demo": { label: "Çalışan demo", variant: "soft" },
  "prototype": { label: "Prototip", variant: "soft" },
  "idea": { label: "Fikir", variant: "dim" },
  "production": { label: "Production", variant: "soft" },
  "abandoned": { label: "Terk edilmiş", variant: "dim" },
};

const REUSE_LABELS = { high: "Yüksek", medium: "Orta", low: "Düşük" } as const;

export function ProjectCard({ project, fitScore }: { project: SeedProject; fitScore?: number }) {
  const st = STATUS_LABELS[project.status];
  return (
    <div className="card card-hover p-5 flex flex-col h-full">
      {/* Üst: başlık + durum */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-medium text-text leading-tight">{project.title}</h3>
        {typeof fitScore === "number" && (
          <div className="text-right shrink-0">
            <div className={`font-mono text-lg font-semibold ${fitScore >= 60 ? "text-ink" : "text-text-soft"}`}>
              {fitScore}
            </div>
            <div className="text-[0.6rem] text-text-faint">uygunluk</div>
          </div>
        )}
      </div>

      <Badge variant={st.variant} className="self-start text-[0.65rem] mb-3">{st.label}</Badge>

      <p className="text-[13px] text-text-soft leading-relaxed mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Tracks */}
      {project.tracks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tracks.map((t) => (
            <Badge key={t} variant="soft" className="text-[0.65rem]">{t}</Badge>
          ))}
        </div>
      )}

      {/* Zincir */}
      {project.chains.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.chains.map((c) => (
            <Badge key={c} variant="muted" className="text-[0.65rem]">{c}</Badge>
          ))}
        </div>
      )}

      {/* Alt: reuse + tech stack */}
      <div className="mt-auto pt-3 border-t border-line-soft space-y-2">
        <div className="flex items-center justify-between text-[0.7rem]">
          <span className="text-text-faint">Yeniden kullanım</span>
          <span className="text-text-soft">{REUSE_LABELS[project.reusePotential]}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t} className="text-[0.62rem] text-text-faint font-mono">{t}</span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[0.62rem] text-text-faint">+{project.techStack.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}
