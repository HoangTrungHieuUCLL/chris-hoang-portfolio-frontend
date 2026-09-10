"use client";

import { VISITOR_KINDS, type VisitorKind } from "@/lib/letta/visitor-kind";
import styles from "@/styles/pollux-chat.module.css";

const ANSWER_LABEL: Record<VisitorKind, string> = {
  recruiter: "Yes",
  casual: "Nope",
};

/**
 * The one question every conversation opens with. Answering is what unlocks
 * the composer (see chat-panel.tsx), so Pollux always knows who it is talking
 * to; the answer is prepended to the first message server-side and never
 * appears in the transcript.
 *
 * Rendered as an assistant message rather than a modal - it is the first turn
 * of the conversation, and it should read like one.
 */
export function VisitorKindGate({ onChoose }: { onChoose: (kind: VisitorKind) => void }) {
  return (
    <div className={styles.gate}>
      <p className={styles.gateQuestion}>Are you a recruiter?</p>
      <div className={styles.gateOptions} role="group" aria-label="Are you a recruiter?">
        {VISITOR_KINDS.map((kind) => (
          <button
            className={styles.gateOption}
            key={kind}
            onClick={() => onChoose(kind)}
            type="button"
          >
            {ANSWER_LABEL[kind]}
          </button>
        ))}
      </div>
    </div>
  );
}
