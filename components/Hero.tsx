import Image from "next/image";
import { profile, skillGroups } from "@/lib/content";
import { SKILL_ICONS } from "@/lib/skillIcons";

const heroSkills = Array.from(new Set(skillGroups.flatMap((group) => group.skills)));

export default function Hero() {
  return (
    <section id="top" className="relative grid md:grid-cols-2 md:min-h-screen">
      <div className="order-2 md:order-1 flex flex-col justify-center py-20 md:py-32 px-6 sm:px-10 lg:pl-[max(2.5rem,calc((100vw-1120px)/2))] lg:pr-12">
        <div className="max-w-xl mx-auto md:mx-0">
          <p className="text-[13px] tracking-[0.2em] uppercase text-subtle mb-5">
            {profile.location} · {profile.visaNote}
          </p>
          <h1 className="text-6xl sm:text-7xl font-semibold tracking-tightest leading-[0.95]">
            {profile.name}
          </h1>

          <div className="mt-6 flex flex-wrap gap-2">
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

          <div className="mt-8 flex flex-wrap items-center gap-4">
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
      </div>

      <div className="order-1 md:order-2 relative h-[55vh] md:h-auto">
        <Image
          src="/chris-hoang-cover-2.jpeg"
          alt={profile.name}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
        />
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="hidden md:block absolute bottom-10 left-[25%] -translate-x-1/2 animate-bounce text-subtle"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
