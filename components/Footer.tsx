import { SiGithub, SiInstagram, SiLinkedin } from "react-icons/si";
import { profile } from "@/lib/content";

const socialLinks = [
  { href: profile.social.linkedin, label: "LinkedIn", Icon: SiLinkedin },
  { href: profile.social.github, label: "GitHub", Icon: SiGithub },
  { href: profile.social.instagram, label: "Instagram", Icon: SiInstagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-content mx-auto section-pad py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-subtle">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, FastAPI &amp; PostgreSQL.
        </p>
        <div className="flex items-center gap-5">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-subtle hover:text-ink transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
