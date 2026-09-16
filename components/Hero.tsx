import Image from "next/image";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { ChatPanel } from "@/components/chat/chat-panel";
import HeroFeaturedWork from "@/components/HeroFeaturedWork";
import { education, profile } from "@/lib/content";
import chatStyles from "@/styles/pollux-chat.module.css";

const socialLinks = [
  { href: profile.social.github, label: "GitHub", Icon: SiGithub },
  { href: profile.social.linkedin, label: "LinkedIn", Icon: SiLinkedin },
];

// Everything a recruiter needs before scrolling: who Chris is, whether they can
// hire him at all (visa, availability), and a way to just ask instead of
// reading.
//
// The facts below the name are plain text rather than pills on purpose - eight
// badges would bury the identity row they sit under, and emphasis reads just as
// well through weight.
export default function Hero() {
  const degree = education[0];

  return (
    <section id="top" className="relative">
      {/* pt-20/md:pt-24 clears the fixed h-14 Nav (bg-paper/70 backdrop-blur)
          with room to spare - pt-14 (exactly the Nav's height) left the
          avatar touching the Nav's bottom edge on phone screens. */}
      <div className="max-w-content mx-auto section-pad pt-20 pb-6 md:pt-24 md:pb-8">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="flex items-start gap-5 sm:gap-6 min-w-0">
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
              </h1>
              <p className="mt-1 text-base">{profile.title}</p>
              <p className="mt-0.5 text-sm text-subtle">{profile.location}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm transition hover:bg-mist"
              >
                <Icon aria-hidden className="w-3.5 h-3.5" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2 text-[13.5px] leading-relaxed text-subtle">
          <p>
            <span className="text-ink font-medium">{profile.visaNote}</span>
            <span className="px-2 text-line">·</span>
            <span className="text-ink font-medium">{profile.availableFrom}</span>
          </p>
          {degree.note && (
            <p>
              <span className="text-ink font-medium">{degree.note}</span>
              <span className="px-2 text-line">·</span>
              {degree.degree}, {degree.school}
            </p>
          )}
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {profile.languages.map((language) => (
              <span key={language.name} className="inline-flex items-center gap-1.5">
                {language.name}
                <span className="rounded bg-mist px-1.5 py-0.5 text-[11px] text-ink">{language.level}</span>
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto section-pad pb-10 md:pb-14 grid lg:grid-cols-5 gap-6 items-stretch">
        <div className={`${chatStyles.widgetRoot} ${chatStyles.widgetRootEmbedded} lg:col-span-3`}>
          <p className="text-[13px] text-subtle mb-4">
            <span className="text-ink font-medium">Skip the scrolling</span> &mdash; ask Pollux, my own AI
            agent, anything about my work.
          </p>
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
