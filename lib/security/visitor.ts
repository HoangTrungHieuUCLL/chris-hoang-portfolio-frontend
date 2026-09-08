import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Per-visitor identity for the Pollux chat widget, entirely stateless: no
 * database, no server-side session store. Each visitor gets one signed,
 * HttpOnly cookie holding a random visitor ID and (once they've sent a first
 * message) the ID of their one ongoing conversation with Pollux. "Signed"
 * means the server can create and verify it, but a visitor cannot forge or
 * edit it (see `sign`/`parse` below) - that's what makes a cookie-only
 * design safe to use as an authorization boundary, not just a convenience.
 *
 * This is simpler than a general multi-conversation chat app on purpose: a
 * floating widget is one continuous conversation per visitor, not a list
 * they manage, so there is exactly one conversation ID to protect rather
 * than a set. Ownership is "does this cookie name this exact ID", full stop.
 *
 * Known limitation (documented in the security notes below): a visitor with
 * cookies fully blocked gets a fresh, empty identity on every request, so
 * they can send a first message but the assistant's reply on a later message
 * in the same sitting won't be recognized as the same conversation. There is
 * no way around this without a login system.
 */

const COOKIE_NAME = "pollux_visitor";
const COOKIE_VERSION = 1;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

type VisitorPayload = {
  v: number;
  id: string;
  conversationId?: string;
};

export type Visitor = {
  id: string;
  conversationId?: string;
};

function getSecret(): string {
  const secret = process.env.POLLUX_COOKIE_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "Missing POLLUX_COOKIE_SECRET. Generate one with `openssl rand -hex 32` " +
        "and add it to .env.local.",
    );
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  const buffer = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buffer.toString("base64url");
}

function sign(payloadB64: string, secret: string): string {
  return base64url(createHmac("sha256", secret).update(payloadB64).digest());
}

function serialize(payload: VisitorPayload): string {
  const payloadB64 = base64url(JSON.stringify(payload));
  const signature = sign(payloadB64, getSecret());
  return `${payloadB64}.${signature}`;
}

function parse(cookieValue: string): VisitorPayload | undefined {
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return undefined;

  const payloadB64 = cookieValue.slice(0, dot);
  const signature = cookieValue.slice(dot + 1);

  const expected = Buffer.from(sign(payloadB64, getSecret()), "base64url");
  const actual = Buffer.from(signature, "base64url");
  // Constant-time comparison: a plain `===` leaks timing information an
  // attacker could use to guess a valid signature one byte at a time.
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return undefined;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as unknown;
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      (decoded as VisitorPayload).v !== COOKIE_VERSION ||
      typeof (decoded as VisitorPayload).id !== "string" ||
      ((decoded as VisitorPayload).conversationId !== undefined &&
        typeof (decoded as VisitorPayload).conversationId !== "string")
    ) {
      return undefined;
    }
    return decoded as VisitorPayload;
  } catch {
    return undefined;
  }
}

function readCookieHeader(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}

/** Reads the visitor identity from the request. Never throws: an absent or
 * tampered cookie just means "no visitor yet", handled the same as a first
 * visit. */
export function readVisitor(request: Request): Visitor | undefined {
  const raw = readCookieHeader(request, COOKIE_NAME);
  if (!raw) return undefined;
  const payload = parse(raw);
  if (!payload) return undefined;
  return { id: payload.id, conversationId: payload.conversationId };
}

/** Creates a brand new visitor identity with no conversation yet. */
export function createVisitor(): Visitor {
  return { id: base64url(randomBytes(16)) };
}

/** Returns a visitor with `conversationId` set as their one ongoing
 * conversation. */
export function withConversation(visitor: Visitor, conversationId: string): Visitor {
  return { id: visitor.id, conversationId };
}

/** Returns a visitor with its conversation cleared (same identity, so rate
 * limits and any future re-visit still recognize them) - used after
 * deleting the conversation, so the next message starts a fresh one. */
export function withoutConversation(visitor: Visitor): Visitor {
  return { id: visitor.id };
}

/** The `Set-Cookie` header value for `visitor`. Attach it to any response
 * that establishes or updates an identity (a fresh visitor, or one who just
 * got a conversation for the first time). */
export function visitorCookieHeader(visitor: Visitor): string {
  const value = serialize({ v: COOKIE_VERSION, id: visitor.id, conversationId: visitor.conversationId });
  // `Secure` is safe for local dev too: browsers treat http://localhost as a
  // secure context. SameSite=Lax is fine since this widget is served from
  // the same site it's embedded in (no cross-origin iframe involved).
  return (
    `${COOKIE_NAME}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; ` +
    "Path=/; HttpOnly; Secure; SameSite=Lax"
  );
}

/** IP address for the rate limiter's secondary key (defense in depth for
 * requests carrying no valid cookie at all). Best-effort: `x-forwarded-for`
 * is client-suppliable in principle, but on Vercel/most PaaS it's set by the
 * platform's edge proxy, not passed through from the client untouched. */
export function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() ?? "unknown";
}
