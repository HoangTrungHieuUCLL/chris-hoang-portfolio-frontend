import { profile, education } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="max-w-content mx-auto section-pad py-28">
      <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">About</h2>
      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-6">
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="text-lg sm:text-xl leading-relaxed text-ink">
              {paragraph}
            </p>
          ))}
        </div>
        <aside className="space-y-8">
          <div>
            <h3 className="text-[13px] uppercase tracking-wide text-subtle mb-2">Looking for</h3>
            <p className="text-base">{profile.lookingFor}</p>
          </div>
          <div>
            <h3 className="text-[13px] uppercase tracking-wide text-subtle mb-2">Languages</h3>
            <ul className="space-y-1 text-base">
              {profile.languages.map((lang) => (
                <li key={lang.name} className="flex justify-between gap-4">
                  <span>{lang.name}</span>
                  <span className="text-subtle">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] uppercase tracking-wide text-subtle mb-2">Education</h3>
            <ul className="space-y-3 text-sm">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="font-medium text-ink">{e.degree}</p>
                  <p className="text-subtle">{e.school}</p>
                  <p className="text-subtle">
                    {e.period}
                    {e.note ? ` · ${e.note}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
