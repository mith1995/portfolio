import { useState } from "react";
import { sendContact } from "../api";
import { useProfile } from "../ProfileContext.js";

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-500";

export default function Contact() {
  const profile = useProfile();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | limited

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContact(form);
      setForm({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch (err) {
      setStatus(err.status === 429 ? "limited" : "error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="glass rounded-[2rem] border border-violet-500/20 p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Contact</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              Let's build something together.
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              Recruiters and clients: send me a message and I will reply as soon as I can.
            </p>

            <div className="mt-8 space-y-4 text-slate-200">
              {profile.email && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg">📧</span>
                  <a href={`mailto:${profile.email}`} className="hover:text-white">{profile.email}</a>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg">📞</span>
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg">📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-700 bg-slate-950/60 p-6">
            <div className="grid gap-5">
              <div>
                <label htmlFor="c-name" className="mb-2 block text-sm text-slate-300">Your Name</label>
                <input id="c-name" required maxLength={120} className={inputClass} placeholder="Enter your name" value={form.name} onChange={update("name")} />
              </div>
              <div>
                <label htmlFor="c-email" className="mb-2 block text-sm text-slate-300">Email Address</label>
                <input id="c-email" type="email" required className={inputClass} placeholder="Enter your email" value={form.email} onChange={update("email")} />
              </div>
              <div>
                <label htmlFor="c-message" className="mb-2 block text-sm text-slate-300">Message</label>
                <textarea id="c-message" rows="5" required maxLength={3000} className={inputClass} placeholder="Tell me about the role or project" value={form.message} onChange={update("message")} />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              <p role="status" className="text-sm">
                {status === "sent" && <span className="text-emerald-300">Thank you! Your message was sent.</span>}
                {status === "limited" && <span className="text-amber-300">Too many messages. Please try again later.</span>}
                {status === "error" && <span className="text-red-300">Could not send. Please try again or email me directly.</span>}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
