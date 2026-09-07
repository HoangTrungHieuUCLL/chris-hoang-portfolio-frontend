import Image from "next/image";
import { profile, skillGroups } from "@/lib/content";
import { SKILL_ICONS } from "@/lib/skillIcons";

const heroSkills = Array.from(new Set(skillGroups.flatMap((group) => group.skills)));

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center section-pad py-32">
      <div className="max-w-content mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full">
        <div className="order-2 md:order-1 text-center md:text-left">
          <p className="text-[13px] tracking-[0.2em] uppercase text-subtle mb-5">
            {profile.location} · {profile.visaNote}
          </p>
          <h1 className="text-6xl sm:text-7xl font-semibold tracking-tightest leading-[0.95]">
            {profile.name}
          </h1>

          <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
            {heroSkills.map((skill) => {
              const Icon = SKILL_ICONS[skill];
              return (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm"
                >
                  {Icon ? <Icon size={14} aria-hidden /> : null}
                  {skill}
                </span>
              );
            })}
          </div>

          <p className="mt-7 text-xl text-subtle font-medium">{profile.title}</p>
          <p className="mt-2 text-base text-subtle italic">&ldquo;{profile.tagline}&rdquo;</p>

          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <a
              href="#projects"
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium hover:opacity-80 transition-opacity"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-full border border-line px-7 py-3 text-[15px] font-medium hover:bg-mist transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-64 sm:w-80 md:w-full md:max-w-md aspect-[1230/1536]">
            <Image
              src="/chris-hoang-cover.png"
              alt={profile.name}
              fill
              priority
              sizes="(min-width: 768px) 28rem, 20rem"
              className="object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-subtle"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
