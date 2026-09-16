"use client";

import { useRoleLane } from "@/components/RoleLaneProvider";
import { ROLES, ROLE_DOT_ON_DARK, ROLE_DOT_ON_PAPER, ROLE_LABEL } from "@/lib/roles";

/**
 * The lane control. Framed as "I'm hiring for" rather than "filter", because
 * the same control reads as range when the visitor picks their own lane and as
 * indecision when it's presented as the visitor sorting through options.
 *
 * Choosing a lane only reorders and emphasises - nothing is ever hidden, so a
 * recruiter in one lane can still see cross-lane work, and every project stays
 * in the DOM for keyword matching.
 */
export default function RoleLanePills() {
  const { role, selectRole } = useRoleLane();

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="text-sm text-subtle">I&rsquo;m hiring for</span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Show work for a role">
        {ROLES.map((option) => {
          const isActive = option === role;
          return (
            <button
              key={option}
              type="button"
              onClick={() => selectRole(option)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition ${
                isActive
                  ? "bg-ink text-paper"
                  : "bg-mist text-subtle hover:text-ink"
              }`}
            >
              {/* The selected pill is ink-filled, so its dot needs the light
                  half of the pair - the paper variant would vanish into it. */}
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? ROLE_DOT_ON_DARK[option] : ROLE_DOT_ON_PAPER[option]
                }`}
                aria-hidden
              />
              {ROLE_LABEL[option]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
