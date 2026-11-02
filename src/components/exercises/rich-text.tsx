import { Fragment, type ReactNode } from "react";

/**
 * Fills a translated template ("You have {duration} with {audience}…") with
 * React nodes, so translators can move placeholders around while the values
 * keep their own styling. Unknown placeholders are left as-is.
 */
export function Rich({ template, values }: { template: string; values: Record<string, ReactNode> }) {
  const parts = template.split(/\{(\w+)\}/g);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{i % 2 === 1 ? (part in values ? values[part] : `{${part}}`) : part}</Fragment>
      ))}
    </>
  );
}
