"use client";

import { useState } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import styles from "@/styles/pollux-chat.module.css";

/**
 * Floating chat bubble present on every page (mounted once, in app/layout.tsx).
 * The panel is only ever mounted after the first open, then kept mounted
 * (just hidden via CSS on close) so the conversation and scroll position
 * survive closing and reopening the widget without refetching.
 */
export default function PolluxChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  function toggle() {
    setIsOpen((wasOpen) => {
      const nextOpen = !wasOpen;
      if (nextOpen) setHasOpenedOnce(true);
      return nextOpen;
    });
  }

  return (
    <div className={styles.widgetRoot}>
      {hasOpenedOnce && (
        <div
          aria-hidden={!isOpen}
          aria-label="Chat with Pollux"
          className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
          role="dialog"
        >
          <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat with Pollux" : "Chat with Pollux"}
        className={styles.bubble}
        onClick={toggle}
        type="button"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
