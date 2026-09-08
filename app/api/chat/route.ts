import {
  LettaAgentClient,
  type CanUseToolResponse,
  type LettaCodeSession,
} from "@letta-ai/letta-agent-sdk/client";
import type { BrowserEvent } from "@/lib/letta/browser-events";
import { createStreamProjection, projectHistoryRows } from "@/lib/letta/sdk-rows";
import { checkRateLimit } from "@/lib/security/rate-limit";
import {
  clientIp,
  createVisitor,
  readVisitor,
  visitorCookieHeader,
  withConversation,
  withoutConversation,
  type Visitor,
} from "@/lib/security/visitor";

export const runtime = "nodejs";

// Public-embed hardening (this widget has no login, so this is the whole
// access-control story):
//   1. checkRateLimit() below, on both the visitor's signed identity and
//      their IP, so a stranger can't drive up cost by hammering this route.
//   2. The conversation ID is never accepted from the client at all - it's
//      always read from (or written to) the caller's own signed cookie, so
//      there is no ID for a request to spoof in the first place.
const CHAT_RATE_LIMIT = Number(process.env.POLLUX_CHAT_RATE_LIMIT ?? 20);
const CHAT_RATE_WINDOW_MS = Number(process.env.POLLUX_CHAT_RATE_WINDOW_MS ?? 10 * 60 * 1000);
// Looser than the per-visitor limit: it exists only to blunt a script that
// discards the cookie between requests to dodge the per-visitor bucket.
const CHAT_IP_RATE_LIMIT = Number(process.env.POLLUX_CHAT_IP_RATE_LIMIT ?? 60);
// Bootstrapping (loading history when the widget opens) is cheaper than a
// chat turn, so it gets a more generous allowance, but it's still a public
// route worth capping rather than leaving unguarded.
const BOOTSTRAP_RATE_LIMIT = Number(process.env.POLLUX_BOOTSTRAP_RATE_LIMIT ?? 60);
const BOOTSTRAP_RATE_WINDOW_MS = Number(process.env.POLLUX_BOOTSTRAP_RATE_WINDOW_MS ?? 10 * 60 * 1000);

/** Newest messages restored when the widget opens. */
const HISTORY_PAGE = 100;
/** Ceiling for "load older messages". One page, never an unbounded fetch. */
const HISTORY_LIMIT = 1000;

function historyLimit(value: string | null) {
  const requested = Number(value);
  if (!Number.isFinite(requested)) return HISTORY_PAGE;
  return Math.min(Math.max(Math.trunc(requested), HISTORY_PAGE), HISTORY_LIMIT);
}

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

/**
 * Tools this widget may run without asking. `LETTA_AUTO_APPROVE_TOOLS` takes
 * a comma-separated list, or `*` for every tool.
 */
function autoApprovedTools() {
  return (process.env.LETTA_AUTO_APPROVE_TOOLS ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

/**
 * Always pass a policy. With no `canUseTool` callback the SDK falls back to
 * *deny*, which is an approval decision the interface never made and never
 * shows. This widget has no approval UI, so the policy is explicit: allow
 * the configured tools, refuse everything else with a message the
 * transcript can render on the failed tool card.
 */
function approvalPolicy(toolName: string): CanUseToolResponse {
  const allowed = autoApprovedTools();
  if (allowed.includes("*") || allowed.includes(toolName)) {
    return { behavior: "allow" };
  }
  return {
    behavior: "deny",
    message:
      `This chat has no approval interface, so "${toolName}" was not run. ` +
      "Add it to LETTA_AUTO_APPROVE_TOOLS, or build an approval UI that " +
      "answers canUseTool.",
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed.";
}

function writeEvent(
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  event: BrowserEvent,
) {
  controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
}

function getClient() {
  return new LettaAgentClient({
    backend: "cloud",
    apiKey: requireEnvironmentVariable("LETTA_API_KEY"),
  });
}

/**
 * Bootstraps the widget: restores the visitor's one ongoing conversation, if
 * they have one yet. No conversation ID is ever read from the request - only
 * from the caller's own signed cookie - so there's nothing here for one
 * visitor to point at another's conversation.
 */
export async function GET(request: Request) {
  let setCookie: string | undefined = undefined;

  try {
    const existingVisitor = readVisitor(request);
    setCookie = existingVisitor ? undefined : visitorCookieHeader(createVisitor());

    const visitorKey = existingVisitor?.id ?? `ip:${clientIp(request)}`;
    const rateLimited = checkRateLimit(`bootstrap:${visitorKey}`, BOOTSTRAP_RATE_LIMIT, BOOTSTRAP_RATE_WINDOW_MS);
    if (!rateLimited.allowed) {
      return withCookie(
        Response.json(
          { error: "Too many requests. Try again shortly." },
          { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimited.retryAfterMs ?? 0) / 1000)) } },
        ),
        setCookie,
      );
    }

    if (!existingVisitor?.conversationId) {
      return withCookie(Response.json({ conversationId: null, rows: [], hasMore: false }), setCookie);
    }

    const client = getClient();
    const session = client.resumeSession(existingVisitor.conversationId);
    try {
      const limit = historyLimit(new URL(request.url).searchParams.get("limit"));
      const state = await session.bootstrapState({ order: "desc", limit });
      if (state.agentId !== requireEnvironmentVariable("LETTA_CHAT_AGENT_ID")) {
        // The stored conversation no longer matches this deployment's agent
        // (e.g. LETTA_CHAT_AGENT_ID changed). Rather than error out, treat it
        // like a fresh visitor - the next message starts a new conversation.
        return withCookie(Response.json({ conversationId: null, rows: [], hasMore: false }), setCookie);
      }
      return withCookie(
        Response.json({
          conversationId: state.conversationId,
          rows: projectHistoryRows(state.messages, { order: "desc" }),
          limit,
          hasMore: state.hasMore ?? false,
          hasPendingApproval: state.hasPendingApproval ?? false,
        }),
        setCookie,
      );
    } finally {
      session.close();
    }
  } catch (error) {
    return withCookie(Response.json({ error: errorMessage(error) }, { status: 500 }), setCookie);
  }
}

function withCookie(response: Response, setCookie: string | undefined) {
  if (!setCookie) return response;
  response.headers.append("Set-Cookie", setCookie);
  return response;
}

/**
 * Removes the visitor's one conversation: archives it on Letta Cloud (the
 * SDK has no hard delete - see the comment below) and clears it from their
 * cookie, so the widget returns to its empty first-visit state. From the
 * visitor's side this is indistinguishable from a real delete: the cookie
 * was their only reference to that conversation ID, so once it's cleared
 * they have no way back to it either way. Idempotent: a visitor with no
 * conversation yet, or one already archived, gets a clean success response
 * rather than an error.
 */
export async function DELETE(request: Request) {
  let setCookie: string | undefined = undefined;

  try {
    const existingVisitor = readVisitor(request);
    setCookie = existingVisitor ? undefined : visitorCookieHeader(createVisitor());

    const visitorKey = existingVisitor?.id ?? `ip:${clientIp(request)}`;
    const rateLimited = checkRateLimit(`delete:${visitorKey}`, BOOTSTRAP_RATE_LIMIT, BOOTSTRAP_RATE_WINDOW_MS);
    if (!rateLimited.allowed) {
      return withCookie(
        Response.json(
          { error: "Too many requests. Try again shortly." },
          { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimited.retryAfterMs ?? 0) / 1000)) } },
        ),
        setCookie,
      );
    }

    if (existingVisitor?.conversationId) {
      try {
        // ConversationsClient in this SDK version has no delete() at all
        // (verified against its actual .d.ts: list/retrieve/create/update/
        // listMessages, nothing else) - archived is the closest real
        // capability it exposes. From the visitor's side this has the same
        // effect as a delete: their cookie is cleared right after, which
        // was their only reference to this conversation ID, so there is no
        // way for them to get back to it either way.
        await getClient().conversations.update(existingVisitor.conversationId, { archived: true });
      } catch {
        // Already archived/gone, or the call itself failed - proceed to
        // clear the cookie regardless; see the doc comment above.
      }
      setCookie = visitorCookieHeader(withoutConversation(existingVisitor));
    }

    return withCookie(Response.json({ success: true }), setCookie);
  } catch (error) {
    return withCookie(Response.json({ error: errorMessage(error) }, { status: 500 }), setCookie);
  }
}

export async function POST(request: Request) {
  let session: LettaCodeSession | undefined;
  // Explicit initial values (not just a type annotation): `jsonError` and the
  // final streaming Response both read `setCookie` from outside the try
  // block, including from the catch path, so it must be definitely assigned
  // from line one, and the catch block must never itself call
  // visitorCookieHeader() again (a signing failure there would otherwise
  // throw a second time while building the error response).
  let visitor: Visitor = createVisitor();
  let setCookie: string | undefined = undefined;

  function jsonError(body: { error: string }, status: number, extraHeaders?: Record<string, string>) {
    return Response.json(body, {
      status,
      headers: { ...(setCookie ? { "Set-Cookie": setCookie } : {}), ...extraHeaders },
    });
  }

  try {
    const existingVisitor = readVisitor(request);
    visitor = existingVisitor ?? createVisitor();
    setCookie = existingVisitor ? undefined : visitorCookieHeader(visitor);

    const visitorKey = existingVisitor?.id ?? `ip:${clientIp(request)}`;
    const perVisitor = checkRateLimit(`chat:${visitorKey}`, CHAT_RATE_LIMIT, CHAT_RATE_WINDOW_MS);
    const perIp = checkRateLimit(`chat-ip:${clientIp(request)}`, CHAT_IP_RATE_LIMIT, CHAT_RATE_WINDOW_MS);
    if (!perVisitor.allowed || !perIp.allowed) {
      const retryAfterMs = Math.max(perVisitor.retryAfterMs ?? 0, perIp.retryAfterMs ?? 0);
      return jsonError(
        { error: "You're sending messages faster than Pollux can keep up. Try again shortly." },
        429,
        { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      );
    }

    const body = (await request.json()) as { message?: unknown; otid?: unknown };
    if (typeof body.message !== "string" || !body.message.trim()) {
      return jsonError({ error: "Message is required." }, 400);
    }
    const message = body.message.trim();

    const client = getClient();
    const agentId = requireEnvironmentVariable("LETTA_CHAT_AGENT_ID");

    let conversationId = visitor.conversationId;
    if (conversationId) {
      const conversation = await client.conversations.retrieve(conversationId);
      if (conversation.agent_id !== agentId) {
        // Stale pointer (e.g. the configured agent changed since this
        // visitor's last visit) - self-heal into a new conversation instead
        // of surfacing an error the visitor can't do anything about.
        conversationId = undefined;
      }
    }
    if (!conversationId) {
      const created = await client.conversations.create({
        agentId,
        summary: message.slice(0, 60),
      });
      conversationId = created.id;
      visitor = withConversation(visitor, conversationId);
      setCookie = visitorCookieHeader(visitor);
    }

    session = client.resumeSession(conversationId, {
      canUseTool: (toolName) => approvalPolicy(toolName),
    });

    // A conversation parked on an approval stays wedged until the runtime is
    // asked to re-drive it through canUseTool. Recovery is best effort: older
    // runtimes report `unsupported`.
    try {
      await session.recoverPendingApprovals();
    } catch {
      // The turn below still runs; a genuinely stuck approval surfaces as a
      // failed tool result.
    }

    // The browser mints the OTID for the row it renders optimistically and
    // sends it here. `send()` stamps the user message with it, so the
    // persisted message comes back carrying the same value and the
    // optimistic row is reconciled instead of duplicated.
    const otid = typeof body.otid === "string" && body.otid.trim() ? body.otid.trim() : undefined;
    await session.send(message, otid ? { otid } : undefined);
  } catch (error) {
    session?.close();
    return jsonError({ error: errorMessage(error) }, 500);
  }

  const activeSession = session;
  const encoder = new TextEncoder();
  let streamClosed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let failure: string | undefined;
      // One accumulator per turn. It reconciles the stream; the route only
      // decides what leaves the server.
      const projection = createStreamProjection();

      try {
        streamMessages: for await (const message of activeSession.stream()) {
          switch (message.type) {
            case "error":
              failure = message.errorDetail ?? message.message;
              break;

            case "result":
              if (!message.success) {
                failure =
                  failure ??
                  message.errorDetail ??
                  message.errorCode ??
                  "Turn failed.";
              }
              break streamMessages;

            default:
              // A retry supersedes the failure that triggered it: the turn
              // re-streams from the top, so the earlier error is not this
              // turn's outcome.
              if (message.type === "retry") failure = undefined;
              // Every other message folds into the accumulator, which returns
              // reconciled rows. Only the rows that changed are written, and
              // only the fields the interface renders.
              for (const event of projection.project(message)) {
                writeEvent(controller, encoder, event);
              }
          }
        }

        writeEvent(
          controller,
          encoder,
          failure ? { type: "error", message: failure } : { type: "done" },
        );
      } catch (error) {
        if (!streamClosed) {
          writeEvent(controller, encoder, {
            type: "error",
            message: errorMessage(error),
          });
        }
      } finally {
        if (!streamClosed) {
          streamClosed = true;
          activeSession.close();
          controller.close();
        }
      }
    },
    cancel() {
      if (!streamClosed) {
        streamClosed = true;
        activeSession.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-ndjson; charset=utf-8",
      ...(setCookie ? { "Set-Cookie": setCookie } : {}),
    },
  });
}
