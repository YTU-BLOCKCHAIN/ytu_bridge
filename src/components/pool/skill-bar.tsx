// Skill seviye göstergesi — 5 noktalı bar + skill adı.
// 1=başlangıç, 5=ileri. Hover'da seviye etiketi.
const LEVEL_LABELS = ["", "başlangıç", "temel", "orta", "ileri", "uzman"];

export function SkillBar({
  name,
  level,
  compact = false,
}: {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5" title={`${name} — seviye ${level} (${LEVEL_LABELS[level]})`}>
      <span
        className={`${compact ? "text-[0.7rem] w-32" : "text-xs w-40"} truncate text-mist`}
      >
        {name}
      </span>
      <div className="flex gap-0.5 shrink-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < level
                ? level >= 4
                  ? "bg-emerald-bright"
                  : level >= 3
                  ? "bg-emerald"
                  : "bg-emerald-dim"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[0.65rem] text-faint w-6 text-right">
        L{level}
      </span>
    </div>
  );
}
