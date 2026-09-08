"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  applyBrowserEvent,
  beginTurn,
  mergeHistoryRows,
  readBrowserEvents,
  type BrowserRow,
  type LiveTranscript,
} from "@/lib/letta/browser-events";
import { messagesFromRows } from "@/lib/letta/transcript";

/** Matches the server's first page. "Load older messages" asks for one more. */
const HISTORY_PAGE = 100;

type BootstrapResponse = {
  conversationId: string | null;
  rows: BrowserRow[];
  limit?: number;
  hasMore?: boolean;
  hasPendingApproval?: boolean;
  error?: string;
};

async function fetchBootstrap(limit?: number): Promise<BootstrapResponse> {
  const query = limit ? `?limit=${limit}` : "";
  const response = await fetch(`/api/chat${query}`);
  const body = (await response.json()) as BootstrapResponse;
  if (!response.ok) throw new Error(body.error ?? `Request failed: ${response.status}`);
  return body;
}

/**
 * One continuous conversation per visitor - there is no conversation list or
 * switcher, unlike the general-purpose template this widget started from.
 * The server (app/api/chat/route.ts) decides whether to resume an existing
 * conversation or start a new one, entirely from the caller's own signed
 * cookie; the browser never tracks or sends a conversation ID at all.
 */
export function useChatSession() {
  // The browser holds accumulator rows, not a hand-merged display model. Every
  // source - restored history, the live stream, and the optimistic user row -
  // merges into this one keyed list.
  const [live, setLive] = useState<LiveTranscript>({ rows: [], applied: [] });
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isNavigating, setIsNavigating] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [navigationError, setNavigationError] = useState<string>();
  const [historyLimit, setHistoryLimit] = useState(HISTORY_PAGE);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [hasPendingApproval, setHasPendingApproval] = useState(false);

  // `retry`, `error`, and the terminal result are turn-level signals rather than
  // rows, so they are applied to the trailing message here.
  const messages = useMemo(
    () => messagesFromRows(live.rows, live.turn),
    [live],
  );

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const result = await fetchBootstrap();
        if (cancelled) return;
        setLive({ rows: result.rows, applied: [] });
        setHasOlderMessages(result.hasMore ?? false);
        setHasPendingApproval(result.hasPendingApproval ?? false);
      } catch (error) {
        if (!cancelled) {
          setNavigationError(
            error instanceof Error ? error.message : "Could not load the chat.",
          );
        }
      } finally {
        if (!cancelled) setIsNavigating(false);
      }
    }

    void start();
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Restore an older page of the conversation.
   *
   * The server rebases one larger page through one accumulator and returns the
   * rows; the browser merges them with history-first ordering, so this is safe
   * even while a turn is streaming: an older row can only ever land before the
   * rows the live turn is writing.
   */
  async function loadOlderMessages() {
    if (isNavigating || isLoadingHistory) return;

    setIsLoadingHistory(true);
    setNavigationError(undefined);
    try {
      const restored = await fetchBootstrap(historyLimit + HISTORY_PAGE);
      setLive((current) => ({
        ...current,
        rows: mergeHistoryRows(current.rows, restored.rows),
      }));
      setHistoryLimit(restored.limit ?? historyLimit + HISTORY_PAGE);
      setHasOlderMessages(restored.hasMore ?? false);
      if (!isSending) setHasPendingApproval(restored.hasPendingApproval ?? false);
    } catch (error) {
      setNavigationError(
        error instanceof Error
          ? error.message
          : "Could not load older messages.",
      );
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isSending || isNavigating) return;

    // The OTID correlates the row rendered now with the message Letta persists.
    // `send()` stamps the user message with it, so a later history merge
    // replaces this row instead of adding a second copy of the same message.
    const otid = crypto.randomUUID();
    setLive((current) =>
      beginTurn(current, { kind: "user", key: `local:${otid}`, otid, text }),
    );
    setInput("");
    setIsSending(true);
    // The next turn asks the runtime to re-drive any pending approval through
    // the route's canUseTool policy, so the restored notice no longer applies.
    setHasPendingApproval(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, otid }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? `Request failed: ${response.status}`);
      }

      for await (const streamEvent of readBrowserEvents(response)) {
        setLive((current) => applyBrowserEvent(current, streamEvent));
      }
    } catch (error) {
      setLive((current) =>
        applyBrowserEvent(current, {
          type: "error",
          message: error instanceof Error ? error.message : "Request failed.",
        }),
      );
    } finally {
      setIsSending(false);
    }
  }

  return {
    messages,
    input,
    setInput,
    isSending,
    isNavigating,
    isLoadingHistory,
    navigationError,
    hasOlderMessages,
    hasPendingApproval,
    loadOlderMessages,
    sendMessage,
  };
}
