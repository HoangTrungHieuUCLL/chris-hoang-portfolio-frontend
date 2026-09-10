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
      </body>
    </html>
  );
}
