"use client";

import { useState } from "react";

/**
 * Renders pre-highlighted code (see lib/highlightCode.ts) inside a real code-editor
 * shell: a header bar with the language and a copy button, full-width, wrapping
 * long lines instead of scrolling them out of view.
 */
export default function CodeBlock({
  code,
  html,
  language = "python",
}: {
  code: string;
  html: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (permissions, insecure context); the
      // button just won't confirm, nothing else to do about it here.
    }
  }

  return (
    <div className="rounded-xl border border-line bg-paper overflow-hidden w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line bg-mist">
        <span className="text-[12px] font-medium text-subtle">{language}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-subtle hover:text-ink transition-colors"
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-[13px] leading-relaxed whitespace-pre-wrap break-words overflow-x-auto">
        <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
