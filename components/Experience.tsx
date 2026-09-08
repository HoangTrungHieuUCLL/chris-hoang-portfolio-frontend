import { experience } from "@/lib/content";

export default function Experience() {
  return (
    <section id="experience" className="bg-mist">
      <div className="max-w-content mx-auto section-pad py-28">
        <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">Experience</h2>
        <ol className="space-y-14">
          {experience.map((job) => (
            <li key={job.role + job.org} className="grid sm:grid-cols-4 gap-4 sm:gap-8">
              <div className="sm:col-span-1 text-sm text-subtle">{job.period}</div>
              <div className="sm:col-span-3">
                <h3 className="text-xl font-semibold">{job.role}</h3>
                <p className="text-subtle mb-3">{job.org}</p>
                <ul className="space-y-2 text-base leading-relaxed">
                  {job.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-line select-none">-</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
