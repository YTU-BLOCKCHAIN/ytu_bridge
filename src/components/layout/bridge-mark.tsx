// Bridge mark — sade köprü logosu. Lacivert tek renk, süs yok.
export function BridgeMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {/* iki kavisli köprü kemerinin birleşimi */}
      <path
        d="M4 22 C 8 10, 24 10, 28 22"
        stroke="#1e3a5f"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M9 22 C 12 14, 20 14, 23 22"
        stroke="#1e3a5f"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* taban çizgisi */}
      <path
        d="M3 23 H 29"
        stroke="#1e3a5f"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

