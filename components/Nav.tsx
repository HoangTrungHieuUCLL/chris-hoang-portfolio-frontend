import { profile } from "@/lib/content";

const links = [
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#data-cleaning", label: "Report" },
  { href: "#sales-dashboard", label: "Dashboard" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper/70 backdrop-blur-md border-b border-line/70">
      <nav className="max-w-content mx-auto flex items-center justify-between h-14 section-pad">
        <a href="#top" className="text-[15px] font-semibold tracking-tight">
          {profile.name}
        </a>
        <ul className="hidden sm:flex items-center gap-8 text-[13px] text-subtle">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-ink transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resumeUrl}
          className="text-[13px] font-medium bg-ink text-paper rounded-full px-4 py-1.5 hover:opacity-80 transition-opacity"
          download
        >
          Resume
        </a>
      </nav>
    </header>
  );
}
