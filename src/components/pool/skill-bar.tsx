// Skill seviye göstergesi — 5 noktalı bar + skill adı.
// 1=başlangıç, 5=ileri.
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
      <span className={`${compact ? "text-[0.72rem] w-32" : "text-xs w-40"} truncate text-text-soft`}>
        {name}
      </span>
      <div className="flex gap-0.5 shrink-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < level ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[0.62rem] text-text-faint w-5 text-right">
        {level}
      </span>
    </div>
  );
}

