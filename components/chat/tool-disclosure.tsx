import type { ToolState } from "@/lib/letta/transcript";
import styles from "@/styles/pollux-chat.module.css";

function formatToolInput(tool: ToolState) {
  // The server sends parsed arguments only. While fragments are still arriving
  // there is nothing safe to show, so the card says so instead of rendering
  // half a JSON document.
  if (tool.argumentsComplete || Object.keys(tool.input).length > 0) {
    return JSON.stringify(tool.input, null, 2);
  }
  return tool.status === "running" ? "Receiving input…" : "{}";
}

export function ToolDisclosure({ tools }: { tools: ToolState[] }) {
  const status: ToolState["status"] = tools.some(
    (tool) => tool.status === "running",
  )
    ? "running"
    : tools.some((tool) => tool.status === "failed")
      ? "failed"
      : "complete";
  const names = [...new Set(tools.map((tool) => tool.name))];
  const label =
    tools.length === 1
      ? tools[0].name
      : names.length === 1
        ? `${names[0]} ×${tools.length}`
        : names.join(", ");
  const summary =
    status === "running"
      ? `${label}…`
      : status === "failed"
        ? `${label} failed`
        : label;

  return (
    <details className={styles.toolDisclosure}>
      <summary aria-label={`${label}, ${status}`}>{summary}</summary>
      <div className={styles.toolList}>
        {tools.map((tool) => (
          <div className={styles.toolItem} key={tool.id}>
            {tools.length > 1 && (
              <div className={styles.toolHeader}>{tool.name}</div>
            )}
            <pre>{formatToolInput(tool)}</pre>
          </div>
        ))}
      </div>
    </details>
  );
}
