import type { Metadata } from "next";
import "./globals.css";
import PolluxChatWidget from "@/components/PolluxChatWidget";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: `${profile.name} - ${profile.title}`,
  description: profile.tagline,
  metadataBase: new URL("https://chrishoang.dev"),
  icons: { icon: "/chris-hoang-sticker-2.png" },
  openGraph: {
    title: `${profile.name} - ${profile.title}`,
    description: profile.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PolluxChatWidget />
        {/* .reveal (components/Reveal.tsx) starts hidden and needs JS
            (IntersectionObserver) to ever become visible - without JS at
            all, this keeps those sections from staying invisible forever. */}
        <noscript>
          <style>{".reveal { opacity: 1 !important; transform: none !important; }"}</style>
        </noscript>
      </body>
    </html>
  );
}
