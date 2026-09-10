/**
 * Before a visitor can talk to Pollux, the widget asks one question - "Are you
 * a recruiter?" - and prepends the answer to the first message it sends, so
 * Pollux knows who it is talking to without the visitor having to say it.
 *
 * The prefix is prompt scaffolding, not something the visitor typed, so it is
 * hidden from the transcript on both sides of the round trip: the optimistic
 * row rendered on send is built from the typed text alone, and
 * `stripVisitorKindPrefix` removes it again when the message comes back from
 * Letta as history (see `visibleUserText` in lib/letta/sdk-rows.ts, which
 * strips Letta's own `<system-reminder>` blocks the same way).
 *
 * No node-only imports here: this module is shared by the browser (the gate
 * component) and the route handler.
 */

export const VISITOR_KINDS = ["recruiter", "casual"] as const;

export type VisitorKind = (typeof VISITOR_KINDS)[number];

/** What gets prepended to the visitor's first message, per answer. */
export const VISITOR_KIND_PREFIX: Record<VisitorKind, string> = {
  recruiter: "I am a recruiter.",
  casual: "I am not a recruiter, just checking around.",
};

export function isVisitorKind(value: unknown): value is VisitorKind {
  return typeof value === "string" && (VISITOR_KINDS as readonly string[]).includes(value);
}

/** The text actually sent to Letta for the conversation's first message. */
export function applyVisitorKindPrefix(kind: VisitorKind, message: string): string {
  return `${VISITOR_KIND_PREFIX[kind]} ${message}`;
}

/**
 * Removes a leading prefix this widget added, so restored history shows what
 * the visitor typed rather than the scaffolding around it. Only strips a
 * prefix at the very start of the message: a visitor who happens to type the
 * same sentence later in a message keeps it.
 */
export function stripVisitorKindPrefix(text: string): string {
  for (const kind of VISITOR_KINDS) {
    const prefix = VISITOR_KIND_PREFIX[kind];
    if (text.startsWith(prefix)) return text.slice(prefix.length).trimStart();
  }
  return text;
}
