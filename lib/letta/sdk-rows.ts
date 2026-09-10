import {
  createTranscriptAccumulator,
  type LettaConversationMessage,
  type SDKMessage,
  type TranscriptRow,
} from "@letta-ai/letta-agent-sdk/client";
import { toBrowserRow, type BrowserEvent, type BrowserRow } from "./browser-events";
import { stripVisitorKindPrefix } from "./visitor-kind";

// The one place this application reads SDK message shapes.
//
// Reconciliation is not hand-rolled here: `createTranscriptAccumulator()` owns
// it for both inputs. The accumulator joins text fragments by message family
// plus `otid` (falling back to `uuid` inside the family), drops replayed
// positions per `runId`, merges tool arguments and results by `toolCallId`, and
// `rebase()` folds a persisted history page into the same rows.
//
// The accumulator runs on the *server* for one reason: its tool rows carry the
// raw tool output. Running it in the browser would mean forwarding the SDK
// messages that contain that output. Folding here means the browser receives
// reconciled rows with the output removed — the narrowest wire that still
// renders the turn.
//
// Everything left in this file is what the accumulator deliberately does not
// own: the turn-level signals (`retry`, `error`, `result`) and the two history
// details this interface cares about.

/**
 * Fold an SDK stream into browser events.
 *
 * Rows returned by `apply()` are referentially stable when a message changed
 * nothing, so an identity comparison against the last sent row is an exact
 * diff: only rows that actually changed reach the browser.
 */
export function createStreamProjection() {
  const accumulator = createTranscriptAccumulator();
  const sent = new Map<string, TranscriptRow>();

  return {
    project(message: SDKMessage): BrowserEvent[] {
      // A retried turn re-streams from the top with a new run, so the rows of
      // the abandoned attempt are dropped rather than accumulated onto. The
      // accumulator leaves `retry` to the consumer by design.
      if (message.type === "retry") {
        accumulator.reset();
        sent.clear();
        return [{ type: "reset" }];
      }

      const events: BrowserEvent[] = [];
      for (const row of accumulator.apply(message)) {
        if (sent.get(row.key) === row) continue;
        sent.set(row.key, row);
        events.push({ type: "row", row: hideUserScaffolding(toBrowserRow(row)) });
      }
      return events;
    },
  };
}

/**
 * Letta injects environment and identity context into the user message as
 * `<system-reminder>` blocks. They are part of the prompt, not part of what the
 * reader typed, so they are removed before the row reaches the browser.
 */
const AUTOMATED_REMINDER =
  /<system-reminder>\s*This is an automated message providing (?:context about the user's environment|information about you)[\s\S]*?<\/system-reminder>\s*/g;

/** `visibleUserText` applied to a row, for the paths that hand rows straight
 * to the browser. Every user row reaching the browser goes through this,
 * whether it came from the live stream or from restored history. */
function hideUserScaffolding(row: BrowserRow): BrowserRow {
  return row.kind === "user" ? { ...row, text: visibleUserText(row.text) } : row;
}

export function visibleUserText(text: string) {
  // The recruiter-question prefix is scaffolding this widget added to the
  // first message, not something the visitor typed, so it comes off here too.
  return stripVisitorKindPrefix(text.replace(AUTOMATED_REMINDER, "").trim());
}

function record(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : undefined;
}

function stringField(source: Record<string, unknown>, key: string) {
  return typeof source[key] === "string" ? (source[key] as string) : undefined;
}

/**
 * Tool calls a person or a policy refused.
 *
 * `approval_response_message` is not transcript content the accumulator claims,
 * so a refusal would otherwise restore as a call still waiting for its result.
 * This chat refuses every tool that is not in `LETTA_AUTO_APPROVE_TOOLS`, so
 * that is the common case rather than an edge case.
 */
function deniedToolCallIds(messages: readonly LettaConversationMessage[]) {
  const denied = new Set<string>();
  let unattributedDenial = false;

  for (const message of messages) {
    const source = record(message);
    if (!source || source.message_type !== "approval_response_message") continue;

    const approvals = Array.isArray(source.approvals) ? source.approvals : [];
    let attributed = false;
    for (const entry of approvals) {
      const approval = record(entry);
      const toolCallId = approval && stringField(approval, "tool_call_id");
      if (!approval || !toolCallId) continue;
      if (approval.approve === false || approval.status === "error") {
        denied.add(toolCallId);
        attributed = true;
      }
    }

    if (attributed || source.approve !== false) continue;
    const toolCallId = stringField(source, "tool_call_id");
    if (toolCallId) denied.add(toolCallId);
    else unattributedDenial = true;
  }

  return { denied, unattributedDenial };
}

function failedToolRow(row: BrowserRow): BrowserRow {
  return row.kind === "tool_call"
    ? { ...row, status: "complete", result: { isError: true } }
    : row;
}

/**
 * Project a persisted history page into the same rows the live stream produces.
 *
 * `rebase()` accepts the page from `bootstrapState()` or `listMessages()`
 * directly and reports the order it was fetched in, so the page never has to be
 * reversed by hand.
 */
export function projectHistoryRows(
  messages: readonly LettaConversationMessage[],
  options?: { order?: "asc" | "desc" },
): BrowserRow[] {
  const accumulator = createTranscriptAccumulator();
  const rows = accumulator.rebase(messages, options).map(toBrowserRow);
  const { denied, unattributedDenial } = deniedToolCallIds(messages);

  const projected = rows.flatMap((row) => {
    if (row.kind === "user") {
      const text = visibleUserText(row.text);
      return text ? [{ ...row, text }] : [];
    }
    return row.kind === "tool_call" && !row.result && denied.has(row.toolCallId)
      ? [failedToolRow(row)]
      : [row];
  });

  if (!unattributedDenial) return projected;

  // An older runtime records a refusal without naming the call. The newest
  // unresolved call is the one it answered.
  const index = projected.findLastIndex(
    (row) => row.kind === "tool_call" && !row.result,
  );
  return index < 0
    ? projected
    : projected.map((row, position) =>
        position === index ? failedToolRow(row) : row,
      );
}
