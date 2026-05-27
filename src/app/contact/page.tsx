'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, GitBranch, ExternalLink, Music2, Send, CheckCircle } from 'lucide-react';

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
};

const view = { once: true, margin: '-40px' as const };
const t    = (delay = 0) => ({ duration: 0.35, ease: 'easeOut' as const, delay });

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'kamadoaditya8@gmail.com',
    href: 'mailto:kamadoaditya8@gmail.com',
  },
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+62 895-328-615-374',
    href: 'https://wa.me/62895328615374',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Medan, Sumatera Utara, Indonesia',
    href: null,
  },
] as const;

const SOCIAL_LINKS = [
  {
    icon: GitBranch,
    label: 'GitHub',
    handle: '@VeldanDev',
    href: 'https://github.com/VeldanDev',
    color: '#f1f1f1',
  },
  {
    icon: ExternalLink,
    label: 'LinkedIn',
    handle: 'Aditya Surya Putra',
    href: 'https://linkedin.com', // TODO: replace with real LinkedIn URL
    color: '#38bdf8',
  },
  {
    icon: Music2,
    label: 'TikTok',
    handle: '@veldorable',
    href: 'https://tiktok.com/@veldorable',
    color: '#fb7185',
  },
] as const;

// ─── Form ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: '', email: '', subject: '', message: '' };

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: keyof FormState;
  type?: string;
  value: string;
  onChange: (id: keyof FormState, val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs text-[#6b7280] tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-[#0a0a0a] border border-[#1f1f1f] rounded-md
                   text-[#f1f1f1] placeholder-[#3d3d3d] outline-none
                   focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20
                   transition-colors duration-150"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);

  function handleChange(id: keyof FormState, val: string) {
    setForm((prev) => ({ ...prev, [id]: val }));
  }

  // TODO: wire up email integration (e.g. Resend, Nodemailer, or a form service like Formspree)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    }, 1200);
  }

  return (
    <div className="min-h-screen px-6 py-14 md:py-20 max-w-4xl mx-auto">

      {/* ── Page header ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={t()}
        className="mb-14"
      >
        <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-2">
          / contact
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f1f1f1] mb-3">
          Contact
        </h1>
        <p className="text-sm text-[#6b7280]">Let&apos;s build something together.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Left column: info + socials ── */}
        <div className="flex flex-col gap-10">

          {/* Contact info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            transition={t()}
          >
            <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-1">reach out</p>
            <h2 className="text-base font-semibold text-[#f1f1f1] mb-5">Contact Info</h2>

            <div className="flex flex-col gap-3">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-4 rounded-lg border border-[#1f1f1f]
                             bg-[#111111]"
                >
                  <Icon size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#4ade80]" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-[#6b7280] hover:text-[#4ade80] transition-colors
                                   duration-150 break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-[#6b7280] break-all">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            transition={t(0.08)}
          >
            <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-1">find me on</p>
            <h2 className="text-base font-semibold text-[#f1f1f1] mb-5">Socials</h2>

            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, handle, href, color }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={view}
                  transition={t(i * 0.06)}
                  className="group flex items-center gap-3 p-3.5 rounded-lg border border-[#1f1f1f]
                             bg-[#111111] hover:border-[#2a2a2a] transition-colors duration-150"
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-md border
                               border-[#1f1f1f] bg-[#0a0a0a] shrink-0 transition-colors duration-150
                               group-hover:border-current"
                    style={{ color }}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#f1f1f1]">{label}</p>
                    <p className="text-[11px] text-[#6b7280]">{handle}</p>
                  </div>
                  <ExternalLink
                    size={11}
                    strokeWidth={1.5}
                    className="ml-auto text-[#3d3d3d] group-hover:text-[#6b7280]
                               transition-colors duration-150"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right column: form ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={view}
          transition={t(0.1)}
        >
          <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-1">send a message</p>
          <h2 className="text-base font-semibold text-[#f1f1f1] mb-5">Get in Touch</h2>

          {submitted ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={t()}
              className="flex flex-col items-center justify-center gap-4 p-10 rounded-lg
                         border border-[#4ade80]/20 bg-[#4ade80]/5 text-center h-full min-h-[360px]"
            >
              <CheckCircle size={32} strokeWidth={1.5} className="text-[#4ade80]" />
              <div>
                <p className="text-sm font-semibold text-[#f1f1f1] mb-1">Message sent!</p>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Thanks for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 text-xs border border-[#1f1f1f] rounded-md text-[#6b7280]
                           hover:text-[#f1f1f1] hover:border-[#2a2a2a] transition-colors duration-150"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Name *"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                <InputField
                  label="Email *"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <InputField
                label="Subject"
                id="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs text-[#6b7280] tracking-wide">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Tell me what you're working on..."
                  className="w-full px-3 py-2.5 text-sm bg-[#0a0a0a] border border-[#1f1f1f] rounded-md
                             text-[#f1f1f1] placeholder-[#3d3d3d] outline-none resize-none
                             focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20
                             transition-colors duration-150"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !form.name || !form.email || !form.message}
                className="flex items-center justify-center gap-2 px-5 py-3 mt-1 rounded-md
                           text-sm font-medium transition-all duration-150
                           bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]
                           hover:bg-[#4ade80]/20 hover:border-[#4ade80]/50
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border border-[#4ade80]/30
                                     border-t-[#4ade80] animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={13} strokeWidth={1.5} />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-[10px] text-[#3d3d3d] text-center">
                * required fields
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
