/** Tiny trend line for a skill's score over time (0–100 scale). */
export function Sparkline({ points, width = 72, height = 24 }: { points: number[]; width?: number; height?: number }) {
  if (points.length < 2) return <svg width={width} height={height} aria-hidden />;
  const min = Math.min(...points) - 2;
  const max = Math.max(...points) + 2;
  const span = Math.max(1, max - min);
  const step = width / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(height - ((p - min) / span) * height).toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="overflow-visible">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((last - min) / span) * height} r={2.5} fill="var(--accent)" />
    </svg>
  );
}
