/**
 * Generative SVG artwork system — deterministic abstract compositions
 * used across projects, experiments and the gallery. Zero network cost,
 * infinitely scalable, art-directed per variant.
 */
export type ArtVariant =
  | "monolith"
  | "orbit"
  | "strata"
  | "signal"
  | "field"
  | "prism"
  | "echo"
  | "grid";

const PALETTES: Record<string, [string, string, string]> = {
  mono: ["#1a1a1f", "#3a3a44", "#e8e4dc"],
  ember: ["#141114", "#5a2410", "#ff4d00"],
  moss: ["#101410", "#24331f", "#c8d8b0"],
  slate: ["#0f1216", "#28323e", "#9fb4c8"],
};

interface ArtworkProps {
  variant: ArtVariant;
  palette?: keyof typeof PALETTES;
  seed?: number;
  className?: string;
  label?: string;
}

function pseudoRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function Artwork({
  variant,
  palette = "mono",
  seed = 7,
  className,
  label,
}: ArtworkProps) {
  const [bg, mid, fg] = PALETTES[palette];
  const rnd = pseudoRandom(seed * 97 + variant.length * 31);
  const gid = `${variant}-${seed}`;

  const strokes = Array.from({ length: 14 }, (_, i) => ({
    x: 40 + rnd() * 720,
    y: 60 + rnd() * 640,
    len: 40 + rnd() * 220,
    w: 0.5 + rnd() * 2.5,
    r: rnd() * 180,
  }));

  return (
    <svg
      className={`artwork ${className ?? ""}`}
      viewBox="0 0 800 800"
      role="img"
      aria-label={label ?? `Abstract artwork, ${variant} composition`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill={`url(#${gid}-sky)`} />

      {variant === "monolith" && (
        <>
          <rect x="300" y="120" width="200" height="560" fill={fg} opacity="0.92" />
          <rect x="300" y="120" width="200" height="560" fill="none" stroke={fg} strokeWidth="1" opacity="0.5" transform="translate(24 24)" />
          <circle cx="620" cy="180" r="56" fill="none" stroke={fg} strokeWidth="1.5" />
          {strokes.slice(0, 6).map((s, i) => (
            <line key={i} x1={s.x} y1={s.y} x2={s.x + s.len} y2={s.y} stroke={fg} strokeWidth={s.w * 0.4} opacity="0.35" />
          ))}
        </>
      )}

      {variant === "orbit" && (
        <>
          {[110, 190, 270, 340].map((r, i) => (
            <circle key={r} cx="400" cy="400" r={r} fill="none" stroke={fg} strokeWidth={i === 1 ? 2 : 0.8} opacity={0.8 - i * 0.15} />
          ))}
          <circle cx="400" cy="130" r="26" fill={fg} />
          <circle cx="670" cy="470" r="10" fill={fg} opacity="0.7" />
          <circle cx="220" cy="560" r="5" fill={fg} opacity="0.5" />
        </>
      )}

      {variant === "strata" &&
        Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={80 + rnd() * 90} y={90 + i * 72} width={300 + rnd() * 340} height={22 + rnd() * 14} fill={fg} opacity={0.25 + rnd() * 0.7} />
        ))}

      {variant === "signal" && (
        <>
          <path
            d={`M 60 400 ${Array.from({ length: 12 }, (_, i) => `L ${60 + i * 60} ${400 + (rnd() - 0.5) * 460}`).join(" ")} L 740 400`}
            fill="none" stroke={fg} strokeWidth="2"
          />
          <line x1="60" y1="400" x2="740" y2="400" stroke={fg} strokeWidth="0.6" opacity="0.4" />
          <circle cx="660" cy="120" r="60" fill={fg} opacity="0.14" />
        </>
      )}

      {variant === "field" && (
        <>
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={70 + c * 95} cy={70 + r * 95} r={4 + ((r * c * seed) % 5) * 3} fill={fg} opacity={0.2 + (((r + c) % 4) * 0.2)} />
            ))
          )}
        </>
      )}

      {variant === "prism" && (
        <>
          <polygon points="400,100 690,620 110,620" fill="none" stroke={fg} strokeWidth="1.6" />
          <polygon points="400,220 590,560 210,560" fill={fg} opacity="0.85" />
          <line x1="80" y1="700" x2="720" y2="700" stroke={fg} strokeWidth="0.8" opacity="0.5" />
        </>
      )}

      {variant === "echo" && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={140 + i * 36} y={140 + i * 36} width={520 - i * 72} height={520 - i * 72} fill="none" stroke={fg} strokeWidth={1.4 - i * 0.2} opacity={1 - i * 0.16} />
          ))}
        </>
      )}

      {variant === "grid" && (
        <>
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={60 + i * 62} y1={60} x2={60 + i * 62} y2={740} stroke={fg} strokeWidth="0.6" opacity="0.3" />
          ))}
          <rect x="248" y="248" width="304" height="304" fill={fg} opacity="0.9" />
          <circle cx="556" cy="248" r="34" fill="none" stroke={fg} strokeWidth="2" />
        </>
      )}

      {/* shared grain — fine technical strokes over every composition */}
      {strokes.slice(0, 5).map((s, i) => (
        <line key={`g${i}`} x1={s.x} y1={s.y} x2={s.x + Math.cos((s.r * Math.PI) / 180) * s.len} y2={s.y + Math.sin((s.r * Math.PI) / 180) * s.len} stroke={fg} strokeWidth={s.w * 0.4} opacity="0.18" />
      ))}
    </svg>
  );
}
