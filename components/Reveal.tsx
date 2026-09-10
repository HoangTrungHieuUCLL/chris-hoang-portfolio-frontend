"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades and slides a section up into place the first time it scrolls into
 * view (see the `.reveal` CSS in app/globals.css). Renders as a plain block
 * wrapper - `<main>` stacks its sections in normal flow, so this adds no
 * visual layout of its own, just the entrance motion.
 *
 * A Client Component wrapping Server Component children is the supported
 * "children as slot" pattern: page.tsx (a Server Component) renders e.g.
 * `<Skills projects={projects} />` and hands the result to this component
 * as `children`, so Skills itself never becomes a Client Component.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal" data-visible={visible}>
      {children}
    </div>
  );
}
