import { profile } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center text-center section-pad">
      <p className="text-[13px] tracking-[0.2em] uppercase text-subtle mb-6">
        {profile.location} · {profile.visaNote}
      </p>
      <h1 className="text-[13vw] sm:text-[8vw] lg:text-[104px] font-semibold tracking-tightest leading-[0.95]">
        {profile.name}
      </h1>
      <p className="mt-6 text-xl sm:text-2xl text-subtle font-medium">{profile.title}</p>
      <p className="mt-3 text-base sm:text-lg text-subtle italic">&ldquo;{profile.tagline}&rdquo;</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-10 animate-bounce text-subtle"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
