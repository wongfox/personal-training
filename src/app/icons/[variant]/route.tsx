import { ImageResponse } from "next/og";

/** PWA icons rendered from the brand mark: /icons/192, /icons/512, /icons/maskable. */
const SIZES: Record<string, { size: number; inset: number }> = {
  "192": { size: 192, inset: 0 },
  "512": { size: 512, inset: 0 },
  maskable: { size: 512, inset: 0.18 },
  apple: { size: 180, inset: 0 },
};

export function generateStaticParams() {
  return Object.keys(SIZES).map((variant) => ({ variant }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ variant: string }> }) {
  const spec = SIZES[(await params).variant];
  if (!spec) return new Response("Not found", { status: 404 });
  const { size, inset } = spec;
  const pad = Math.round(size * inset);
  const inner = size - pad * 2;
  return new ImageResponse(
    (
      <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#16150f" }}>
        <svg width={inner} height={inner} viewBox="0 0 32 32">
          <path d="M8 22.5h16" stroke="#f4f2ed" strokeWidth="2" strokeLinecap="round" />
          <path d="M9.5 18.5c2.6-5.6 9.8-8.2 13.5-8" stroke="#d4532a" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="23" cy="10.5" r="2.2" fill="#d4532a" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
