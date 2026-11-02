/**
 * Tiny, dependency-free translator shared by server and client.
 *
 * Keys are dot paths into the message tree ("home.greeting"). Values may hold
 * {placeholders}. Plurals: when `count` is passed and "<key>_one" /
 * "<key>_other" exist, the right form is chosen.
 */

export type MessageTree = { [key: string]: string | MessageTree };
export type Vars = Record<string, string | number>;
export type TFunction = (key: string, vars?: Vars) => string;

function lookup(tree: MessageTree, path: string): string | MessageTree | undefined {
  let node: string | MessageTree | undefined = tree;
  for (const part of path.split(".")) {
    if (node === undefined || typeof node === "string") return undefined;
    node = node[part];
  }
  return node;
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function createTranslator(messages: MessageTree, fallback?: MessageTree): TFunction {
  return (key, vars) => {
    if (vars && typeof vars.count === "number") {
      const form = vars.count === 1 ? `${key}_one` : `${key}_other`;
      const plural = lookup(messages, form) ?? (fallback ? lookup(fallback, form) : undefined);
      if (typeof plural === "string") return interpolate(plural, vars);
    }
    const value = lookup(messages, key) ?? (fallback ? lookup(fallback, key) : undefined);
    if (typeof value === "string") return interpolate(value, vars);
    if (process.env.NODE_ENV !== "production") console.warn(`[i18n] missing message: ${key}`);
    return key;
  };
}
