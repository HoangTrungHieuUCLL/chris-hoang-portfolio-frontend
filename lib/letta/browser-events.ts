import type { TranscriptRow } from "@letta-ai/letta-agent-sdk/client";

// The wire protocol between the server routes and React.
//
// The server runs the SDK's transcript accumulator
// (`lib/letta/sdk-rows.ts`) and sends the rows it produces. A row is already
// reconciled — fragments joined, replays dropped, tool arguments merged — so the
// browser never merges by array position and never re-implements identity.
//
// `BrowserRow` is a deliberate, field-by-field narrowing of the SDK's
// `TranscriptRow`. Two fields of the SDK row are dropped on purpose:
//
//   result.content   raw tool output. It stays on the server.
//   rawArguments     partial argument JSON. `toolInput` plus
//                    `argumentsComplete` is everything the interface renders.
//
// Because the projection lists the fields it copies, a new field on the SDK row
// cannot reach the browser by accident.

/** Tool outcome without the tool's output. */
export type BrowserToolResult = { isError: boolean };

export type BrowserTextRow = {
  kind: "user" | "assistant" | "reasoning";
  /** Stable row key minted by the accumulator. */
  key: string;
  text: string;
  /**
   * Offline threading id, when the row has one. This is what correlates an
   * optimistic user row with the persisted message that comes back later.
   */
  otid?: string;
};

export type BrowserToolCallRow = {
  kind: "tool_call";
  key: string;
  toolCallId: string;
  toolName: string;
  /** Parsed arguments. Never the transitional `{ raw }` wrapper. */
  toolInput: Record<string, unknown>;
  argumentsComplete: boolean;
  status: "streaming" | "ready" | "complete";
  result?: BrowserToolResult;
};

export type BrowserRow = BrowserTextRow | BrowserToolCallRow;

export type BrowserEvent =
  /** One accumulator row that changed. The browser upserts it by identity. */
  | { type: "row"; row: BrowserRow }
  /** A retry restarted the turn: drop the rows this turn produced. */
  | { type: "reset" }
  | { type: "error"; message: string }
  | { type: "done" };

/**
 * Narrow one accumulator row to the fields the browser renders.
 *
 * Server-side only in practice, but pure and dependency-free so the fixture
 * tests can assert on exactly what the wire carries.
 */
export function toBrowserRow(row: TranscriptRow): BrowserRow {
  if (row.kind === "tool_call") {
    return {
      kind: "tool_call",
      key: row.key,
      toolCallId: row.toolCallId,
      toolName: row.toolName,
      toolInput: row.toolInput,
      argumentsComplete: row.argumentsComplete,
      status: row.status,
      // The outcome travels; the output does not.
      ...(row.result ? { result: { isError: row.result.isError } } : {}),
    };
  }

  return {
    kind: row.kind,
    key: row.key,
    text: row.text,
    ...(row.otid ? { otid: row.otid } : {}),
  };
}

/**
 * Identity used to reconcile a row across its sources: the live stream, the
 * restored history page, and the optimistic row the browser renders before the
 * server has seen the message.
 *
 * A row minted locally cannot know the key the accumulator will choose, but it
 * does know the `otid` it asked `send()` to use, and the persisted message comes
 * back carrying that same `otid`. Matching on family + `otid` first means the
 * optimistic row is *replaced* by its persisted self instead of duplicated.
 */
export function rowIdentity(row: BrowserRow) {
  return row.kind !== "tool_call" && row.otid
    ? `${row.kind}:otid:${row.otid}`
    : row.key;
}

/** Upsert one streamed row. Position is the order the row first appeared. */
export function mergeRow(
  rows: readonly BrowserRow[],
  row: BrowserRow,
): BrowserRow[] {
  const identity = rowIdentity(row);
  const index = rows.findIndex((existing) => rowIdentity(existing) === identity);
  if (index < 0) return [...rows, row];
  return rows.map((existing, position) => (position === index ? row : existing));
}

/**
 * Merge a restored history page into the rows already on screen.
 *
 * This is the browser-side twin of the accumulator's own `rebase()`: history
 * rows replace what they name and keep the order the server sent, and rows that
 * exist only in the live stream keep their relative order after them. Merging
 * this way is what makes "load older messages" safe while a turn is streaming —
 * an older page can never interleave with the rows the turn is still writing.
 */
export function mergeHistoryRows(
  rows: readonly BrowserRow[],
  history: readonly BrowserRow[],
): BrowserRow[] {
  const merged = new Set(history.map(rowIdentity));
  return [
    ...history,
    ...rows.filter((row) => !merged.has(rowIdentity(row))),
  ];
}

/**
 * State of the turn currently streaming.
 *
 * `retry`, `error`, and the terminal result are turn-level SDK signals, not
 * transcript rows — the accumulator does not own them, so they are tracked
 * beside the rows.
 */
export type TurnState = { streaming: boolean; error?: string };

export type LiveTranscript = {
  rows: BrowserRow[];
  turn?: TurnState;
  /** Row identities this turn contributed, so a retry drops exactly those. */
  applied: string[];
};

/** Start a turn from the optimistic user row the browser mints. */
export function beginTurn(
  state: LiveTranscript,
  userRow: BrowserTextRow,
): LiveTranscript {
  return {
    rows: mergeRow(state.rows, userRow),
    turn: { streaming: true },
    applied: [],
  };
}

/**
 * The complete live reducer. Rows are already reconciled, so this only decides
 * where a row goes and what a turn-level signal means.
 */
export function applyBrowserEvent(
  state: LiveTranscript,
  event: BrowserEvent,
): LiveTranscript {
  if (event.type === "row") {
    const identity = rowIdentity(event.row);
    return {
      ...state,
      rows: mergeRow(state.rows, event.row),
      applied: state.applied.includes(identity)
        ? state.applied
        : [...state.applied, identity],
    };
  }

  if (event.type === "reset") {
    // A retried turn re-streams from the top. Drop what the abandoned attempt
    // wrote — and only that, so restored history survives a retry.
    const abandoned = new Set(state.applied);
    return {
      rows: state.rows.filter((row) => !abandoned.has(rowIdentity(row))),
      turn: { streaming: true },
      applied: [],
    };
  }

  return {
    ...state,
    turn: {
      streaming: false,
      ...(event.type === "error" ? { error: event.message } : {}),
    },
  };
}

export async function* readBrowserEvents(response: Response) {
  if (!response.body) throw new Error("The response has no body.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line) yield JSON.parse(line) as BrowserEvent;
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) yield JSON.parse(buffer) as BrowserEvent;
}
