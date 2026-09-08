import type { Dispatch, FormEvent, SetStateAction } from "react";
import styles from "@/styles/pollux-chat.module.css";

type ChatComposerProps = {
  input: string;
  isSending: boolean;
  isNavigating: boolean;
  onInputChange: Dispatch<SetStateAction<string>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatComposer({
  input,
  isSending,
  isNavigating,
  onInputChange,
  onSubmit,
}: ChatComposerProps) {
  return (
    <form aria-busy={isSending} className={styles.composer} onSubmit={onSubmit}>
      <input
        aria-label="Message"
        disabled={isSending || isNavigating}
        onChange={(event) => onInputChange(event.target.value)}
        placeholder={isSending ? "Pollux is working…" : "Ask Pollux about Chris"}
        value={input}
      />
      <button
        aria-label={isSending ? "Pollux is responding" : "Send message"}
        className={isSending ? styles.sendingButton : undefined}
        disabled={isSending || isNavigating || !input.trim()}
      >
        {isSending ? <span className={styles.spinner} aria-hidden="true" /> : "↑"}
      </button>
    </form>
  );
}
