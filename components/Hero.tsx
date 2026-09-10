import Image from "next/image";
import { ChatPanel } from "@/components/chat/chat-panel";
import HeroFeaturedWork from "@/components/HeroFeaturedWork";
import { profile } from "@/lib/content";
import chatStyles from "@/styles/pollux-chat.module.css";

// Everything a first-time, non-technical visitor needs without scrolling:
// who Chris is, what he's looking for, a way to just ask ("chat with
// Pollux" instead of reading), and proof of work. The floating widget
// (PolluxChatWidget, mounted globally) stays hidden while this section is
// in view and only appears once the visitor scrolls past it - see its
// IntersectionObserver on this section's `#top` id.
export default function Hero() {
  return (
    <section id="top" className="relative">
      {/* pt-14/md:pt-20 clears the fixed h-14 Nav (bg-paper/70 backdrop-blur) -
          don't shrink this below the Nav's own height or it overlaps. */}
      <div className="max-w-content mx-auto section-pad pt-14 pb-6 md:pt-20 md:pb-8">
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden ring-1 ring-line">
            <Image
              src="/chris-hoang-cover-2.jpeg"
              alt={profile.name}
              fill
              sizes="(min-width: 640px) 64px, 56px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest leading-tight">
              {profile.name}
              <span className="text-subtle font-medium"> · {profile.title}</span>
            </h1>
            <p className="mt-1 text-sm text-subtle">{profile.location}</p>
            <p className="mt-2 inline-flex items-center rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink">
              Are you looking for a Data Analyst, Data Engineer or AI Engineer?
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto section-pad pb-10 md:pb-14 grid lg:grid-cols-5 gap-6 items-stretch">
        <div className={`${chatStyles.widgetRoot} ${chatStyles.widgetRootEmbedded} lg:col-span-3`}>
          <p className="text-[13px] tracking-[0.2em] uppercase text-subtle mb-4">Ask Pollux</p>
          <div className={chatStyles.embeddedPanel}>
            <ChatPanel isOpen embedded />
          </div>
        </div>

        <div className="lg:col-span-2">
          <HeroFeaturedWork />
        </div>
      </div>

      <a
        href="#skills"
        aria-label="Scroll to Skills section"
        className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-subtle"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
