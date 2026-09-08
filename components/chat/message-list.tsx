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
  viewportRef: RefObject<HTMLDivElement | null>;
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
