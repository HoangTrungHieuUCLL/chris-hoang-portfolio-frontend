// Server-side syntax highlighting: Prism.highlight() is synchronous and DOM-free,
// so this runs at render time on the server and ships zero highlighter JS to the
// browser: only the resulting <span class="token ..."> markup goes over the wire.
// Colors for those classes live in globals.css.
import Prism from "prismjs";
import "prismjs/components/prism-python";

export function highlightPython(code: string): string {
  try {
    return Prism.highlight(code, Prism.languages.python, "python");
  } catch {
    // Should never happen for well-formed Python, but fall back to plain
    // (escaped) text rather than let a highlighter bug break the page.
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
