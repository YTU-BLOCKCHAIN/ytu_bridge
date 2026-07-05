import { SEED_PROJECTS } from "@/lib/seed-projects";
import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { scoreProjectFit } from "@/lib/seed-projects";
import { ProjectCard } from "@/components/project-card";

export default function ProjectsPage() {
  // Her proje için en uygun hackathon'u bul
  const upcoming = DISCOVERED_HACKATHONS.filter((h) => h.status === "upcoming");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Projeler</h1>
        <p className="text-text-soft mt-2 max-w-2xl leading-relaxed">
          Kulübün mevcut proje envanteri. Her hackathon için uygunluk skoru
          hesaplanır — track, zincir ve tech stack örtüşmesine göre.
        </p>
      </div>

      {/* Envanter */}
      <div>
        <h2 className="text-sm font-medium text-text-soft mb-3">Envanter · {SEED_PROJECTS.length} proje</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEED_PROJECTS.map((p) => {
            // En uygun yaklaşan hackathon
            let bestScore: number | undefined;
            if (upcoming.length > 0) {
              const scores = upcoming.map((h) => scoreProjectFit(p, h).score);
              bestScore = Math.max(...scores);
            }
            return <ProjectCard key={p.id} project={p} fitScore={bestScore} />;
          })}
        </div>
      </div>

      {/* Hackathon bazlı eşleştirme */}
      {upcoming.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-text-soft mb-3">Hackathon bazlı eşleştirme</h2>
          <div className="space-y-6">
            {upcoming.map((h) => {
              const fits = SEED_PROJECTS.map((p) => ({
                project: p,
                fit: scoreProjectFit(p, h),
              }))
                .sort((a, b) => b.fit.score - a.fit.score)
                .slice(0, 3);

              return (
                <div key={h.id} className="card p-5">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="font-medium text-text">{h.name}</div>
                      <div className="text-sm text-text-soft">{h.organizer}</div>
                    </div>
                    <div className="flex gap-1.5">
                      {h.tracks.map((t) => (
                        <span key={t} className="chip chip-ink text-[0.6rem]">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {fits.map(({ project, fit }) => (
                      <div key={project.id} className="flex items-start gap-4 py-3 border-t border-line-soft first:border-0 first:pt-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text">{project.title}</span>
                            <span className={`chip text-[0.6rem] ${fit.score >= 60 ? "chip-good" : "chip-dim"}`}>
                              {fit.score}/100
                            </span>
                          </div>
                          {fit.gaps.length > 0 && (
                            <div className="text-[0.72rem] text-warn mt-1">
                              {fit.gaps.join(" · ")}
                            </div>
                          )}
                          {fit.matchedTracks.length > 0 && (
                            <div className="text-[0.72rem] text-text-faint mt-1">
                              eşleşen: {fit.matchedTracks.join(", ")}
                              {fit.matchedChains.length > 0 && ` · ${fit.matchedChains.join(", ")}`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


