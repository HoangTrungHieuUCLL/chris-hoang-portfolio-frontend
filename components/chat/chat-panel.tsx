"use client";

import { ChatComposer } from "./chat-composer";
import { MessageList } from "./message-list";
import { VisitorKindGate } from "./visitor-kind-gate";
import { useChatSession } from "@/hooks/use-chat-session";
import { useFollowOutput } from "@/hooks/use-follow-output";
import styles from "@/styles/pollux-chat.module.css";

/**
 * The chat itself: one continuous conversation, no sidebar or conversation
 * switcher (see hooks/use-chat-session.ts for why - this is a floating
 * widget, not the general-purpose multi-conversation template it started
 * from). Mounted once, on first open, by PolluxChatWidget, and then kept
 * mounted (just visually hidden) so closing and reopening the bubble never
 * re-fetches the conversation from scratch.
 */
export function ChatPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const chat = useChatSession();
  // Re-scrolls to the latest message whenever the panel opens.
  const viewportRef = useFollowOutput(chat.messages, String(isOpen));

  return (
    <div className={styles.panelInner}>
      <header className={styles.panelHeader}>
        <span className={styles.panelTitle}>Chat with Pollux</span>
        <div className={styles.panelHeaderActions}>
          {chat.messages.length > 0 && (
            <button
              aria-label="Delete this conversation"
              className={styles.panelClose}
              disabled={chat.isDeleting}
              onClick={() => {
                if (window.confirm("Delete this conversation? This can't be undone.")) {
                  void chat.deleteChat();
                }
              }}
              title="Delete this conversation"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <button
            aria-label="Close chat"
            className={styles.panelClose}
            onClick={onClose}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <MessageList
        hasOlderMessages={chat.hasOlderMessages}
        hasPendingApproval={chat.hasPendingApproval}
        isLoading={chat.isNavigating}
        isLoadingHistory={chat.isLoadingHistory}
        messages={chat.messages}
        onLoadOlderMessages={chat.loadOlderMessages}
        viewportRef={viewportRef}
      />

      {chat.navigationError && <p className={`${styles.notice} ${styles.error}`}>{chat.navigationError}</p>}

      {chat.needsVisitorKind ? (
        <VisitorKindGate onChoose={chat.chooseVisitorKind} />
      ) : (
        <ChatComposer
          input={chat.input}
          isNavigating={chat.isNavigating}
          isSending={chat.isSending}
          onInputChange={chat.setInput}
          onSubmit={chat.sendMessage}
        />
      )}
    </div>
  );
}
