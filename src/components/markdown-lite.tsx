import { Fragment, type ReactNode } from "react";

/**
 * Renders the CMS's lightweight markdown (paragraphs, "## " headings, "- "
 * bullets, "1. " steps and **bold**) as React elements — no HTML injection.
 */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}

export function MarkdownLite({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-4 text-[16px] leading-[1.7] text-ink-2">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim());
        if (lines.length === 0) return null;
        if (lines[0].startsWith("## ")) {
          return (
            <Fragment key={i}>
              <h2 className="pt-3 font-display text-[23px] leading-[1.2] text-ink">{inline(lines[0].slice(3))}</h2>
              {lines.length > 1 && <MarkdownLite source={lines.slice(1).join("\n")} />}
            </Fragment>
          );
        }
        if (lines.every((l) => /^- /.test(l.trim()))) {
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{inline(l.trim().slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l.trim()))) {
          return (
            <ol key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[12px] font-semibold tabular-nums text-accent" aria-hidden>
                    {j + 1}
                  </span>
                  <span>{inline(l.trim().replace(/^\d+\. /, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </div>
  );
}
