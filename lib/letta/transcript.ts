import type { BrowserRow, TurnState } from "./browser-events";

// The display model. One ordered part list per message, built from the rows the
// server sent. Reconciliation already happened in the accumulator, so this file
// only groups rows for React: it never joins fragments and never merges by
// array position.

export type ToolState = {
  id: string;
  name: string;
  input: Record<string, unknown>;
  /** False while argument fragments are still arriving. */
  argumentsComplete: boolean;
  status: "running" | "complete" | "failed";
};

export type MessagePart =
  | { type: "text"; content: string }
  | { type: "reasoning"; content: string; complete: boolean }
  | { type: "tools"; tools: ToolState[] };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  complete: boolean;
  error?: string;
};

function toolState(row: Extract<BrowserRow, { kind: "tool_call" }>): ToolState {
  return {
    id: row.toolCallId,
    name: row.toolName,
    input: row.toolInput,
    argumentsComplete: row.argumentsComplete,
    status: row.result
      ? row.result.isError
        ? "failed"
        : "complete"
      : "running",
  };
}

function settleParts(message: ChatMessage, status: "complete" | "failed") {
  message.parts = message.parts.map((part) => {
    if (part.type !== "tools") return part;
    return {
      ...part,
      tools: part.tools.map((tool) =>
        tool.status === "running" ? { ...tool, status } : tool,
      ),
    };
  });
}

/**
 * Group ordered rows into messages.
 *
 * A `user` row starts a new exchange; every other row belongs to the assistant
 * message after it. Consecutive tool rows share one disclosure, and anything
 * between them keeps its emitted position — the order the reader saw while the
 * turn streamed is the order a reload restores.
 */
export function messagesFromRows(
  rows: readonly BrowserRow[],
  turn?: TurnState,
): ChatMessage[] {
  const messages: ChatMessage[] = [];
  let assistant: ChatMessage | undefined;
  let exchange = 0;

  function ensureAssistant(fallbackId: string) {
    if (assistant) return assistant;
    assistant = {
      id: `${fallbackId}:assistant`,
      role: "assistant",
      parts: [],
      complete: true,
    };
    messages.push(assistant);
    return assistant;
  }

  for (const row of rows) {
    if (row.kind === "user") {
      exchange += 1;
      messages.push({
        id: row.key,
        role: "user",
        parts: [{ type: "text", content: row.text }],
        complete: true,
      });
      assistant = undefined;
      continue;
    }

    // The assistant message is named after the exchange, not after its first
    // row, so its React identity survives the first row arriving.
    const message = ensureAssistant(`exchange-${exchange}`);

    if (row.kind === "tool_call") {
      // Only *consecutive* calls share one disclosure. A call after some text
      // is a new group at its own position.
      const lastPart = message.parts.at(-1);
      if (lastPart?.type === "tools") {
        lastPart.tools.push(toolState(row));
      } else {
        message.parts.push({ type: "tools", tools: [toolState(row)] });
      }
      continue;
    }

    message.parts.push(
      row.kind === "assistant"
        ? { type: "text", content: row.text }
        : { type: "reasoning", content: row.text, complete: true },
    );
  }

  if (!turn) return messages;

  // The live turn always writes at the end of the transcript.
  const trailing = messages.at(-1);
  if (!trailing || trailing.role !== "assistant") {
    if (!turn.streaming) return messages;
    // Same id the first assistant row will produce, so the message React
    // mounted while the agent was thinking is the message that fills in.
    messages.push({
      id: `exchange-${exchange}:assistant`,
      role: "assistant",
      parts: [],
      complete: false,
      ...(turn.error ? { error: turn.error } : {}),
    });
    return messages;
  }

  trailing.complete = !turn.streaming;
  if (turn.error) trailing.error = turn.error;

  if (turn.streaming) {
    // Reasoning stays open until something follows it or the turn ends.
    const lastPart = trailing.parts.at(-1);
    if (lastPart?.type === "reasoning") lastPart.complete = false;
  } else {
    settleParts(trailing, turn.error ? "failed" : "complete");
  }

  return messages;
}
