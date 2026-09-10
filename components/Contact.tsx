"use client";

import { useState, type FormEvent } from "react";
import { submitContactMessage } from "@/lib/api";
import { profile } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await submitContactMessage({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    if (result.ok) {
      setStatus("sent");
      form.reset();
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="max-w-content mx-auto section-pad py-28">
      <h2 className="text-sm tracking-[0.2em] uppercase text-subtle mb-10">Contact</h2>
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Let&apos;s work together.
          </h3>
          <p className="text-lg text-subtle mb-6">
            Open to junior Data Analyst, Data Engineer, and AI Engineer roles. Reach out directly
            or use the form.
          </p>
          <a href={`mailto:${profile.email}`} className="text-lg font-medium underline underline-offset-4">
            {profile.email}
          </a>
          <p className="text-subtle mt-1">{profile.phone}</p>
        </div>

        {status === "sent" ? (
          <div className="flex items-center rounded-2xl border border-line p-8 text-lg">
            Thanks for reaching out. I&apos;ll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[13px] uppercase tracking-wide text-subtle mb-1.5">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                maxLength={120}
                className="w-full rounded-lg border border-line px-4 py-3 text-base transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[13px] uppercase tracking-wide text-subtle mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-line px-4 py-3 text-base transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-[13px] uppercase tracking-wide text-subtle mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={4000}
                className="w-full rounded-lg border border-line px-4 py-3 text-base transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-ink text-paper px-7 py-3 text-[15px] font-medium transition hover:opacity-80 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
