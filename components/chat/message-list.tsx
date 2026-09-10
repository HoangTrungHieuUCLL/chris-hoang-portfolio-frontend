import type { RefObject } from "react";
import type { ChatMessage } from "@/lib/letta/transcript";
import { TranscriptMessage } from "./transcript-message";
import styles from "@/styles/pollux-chat.module.css";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  hasOlderMessages: boolean;
  hasPendingApproval: boolean;
  onLoadOlderMessages: () => void;
  // Not `RefObject<HTMLDivElement | null>`: under this project's React 18
  // types (unlike the React 19 types the upstream template was written
  // against), useRef<HTMLDivElement>(null) in use-follow-output.ts already
  // produces RefObject<HTMLDivElement>, and the `| null` union on top of
  // that made it a different, non-assignable type for the div's ref prop.
  viewportRef: RefObject<HTMLDivElement>;
};

export function MessageList({
  messages,
  isLoading,
  isLoadingHistory,
  hasOlderMessages,
  hasPendingApproval,
  onLoadOlderMessages,
  viewportRef,
}: MessageListProps) {
  return (
    <div className={styles.thread} aria-live="polite" ref={viewportRef}>
      {messages.length === 0 && !isLoading && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Hi, I&rsquo;m Pollux 👋</p>
          <p className={styles.emptyBody}>
            I know Chris&rsquo;s work inside and out, but I won&rsquo;t guess. If I don&rsquo;t know
            something, I&rsquo;ll say so and point you to his email instead.
          </p>
          <p className={styles.emptyNotice}>
            Heads up: I don&rsquo;t save anything that could identify you personally, but
            everything sent and received here is recorded and stored in an encrypted
            database &mdash; let&rsquo;s keep it professional. Hit the trash icon above and
            it&rsquo;s gone from your side for good &mdash; there&rsquo;s no way back to it, ever.
          </p>
        </div>
      )}
      {hasOlderMessages && !isLoading && (
        <p className={styles.notice}>
          <button
            className={styles.noticeAction}
            disabled={isLoadingHistory}
            onClick={onLoadOlderMessages}
            type="button"
          >
            {isLoadingHistory ? "Loading older messages…" : "Load older messages"}
          </button>
        </p>
      )}
      {hasPendingApproval && !isLoading && (
        <p className={styles.notice}>
          This conversation is waiting on a tool approval. Sending the next
          message asks the agent to resolve it with this app&rsquo;s approval
          policy.
        </p>
      )}
      {messages.map((message) => (
        <TranscriptMessage key={message.id} message={message} />
      ))}
    </div>
  );
}
