'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, MessageCircle, MapPin, GitBranch, Music2, ArrowUpRight, Send } from 'lucide-react';

const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff', cyan: '#45e0d0',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';
const EMAIL = 'kamadoaditya8@gmail.com';
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const view = { once: true, margin: '-50px' } as const;

const CHANNELS = [
  { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, color: C.violet },
  { icon: MessageCircle, label: 'WhatsApp', value: '+62 895-328-615-374', href: 'https://wa.me/62895328615374', color: C.cyan },
  { icon: GitBranch, label: 'GitHub', value: '@VeldanDev', href: 'https://github.com/VeldanDev', color: '#6ea8ff' },
  { icon: Music2, label: 'TikTok', value: '@veldorable', href: 'https://www.tiktok.com/@veldorable', color: '#3ee6a0' },
  { icon: MapPin, label: 'Location', value: 'Medan, Indonesia', href: null, color: C.muted },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', subject: '', message: '' });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message) return;
    const subject = encodeURIComponent(form.subject || `Portfolio message from ${form.name || 'someone'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name || ''}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  const inputCls = 'w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition-colors duration-200';
  const inputStyle = { background: C.panel2, border: `1px solid ${C.line}`, color: C.text } as const;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100dvh', fontFamily: 'var(--font-sans-body)' }}>
      <div className="px-6 md:px-10 py-16 md:py-20 max-w-4xl mx-auto">

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, ease }} className="mb-12">
          <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>/ contact</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>Let&apos;s build something</h1>
          <p className="text-sm max-w-md" style={{ color: C.muted }}>Open to roles, freelance, and collaboration in AI, security, and software. I usually reply within a day.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* channels */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={view} transition={{ duration: 0.5, ease }} className="flex flex-col gap-3">
            {CHANNELS.map((c, k) => {
              const Icon = c.icon;
              const inner = (
                <>
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg border shrink-0" style={{ borderColor: C.line2, background: C.panel2, color: c.color }}>
                    <Icon size={17} strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>{c.label}</p>
                    <p className="text-sm truncate" style={{ color: C.text }}>{c.value}</p>
                  </div>
                  {c.href && <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: C.muted }} />}
                </>
              );
              const cls = 'spec-card group relative flex items-center gap-4 rounded-xl border p-4 overflow-hidden';
              const style = { borderColor: C.line, background: C.panel };
              return c.href ? (
                <motion.a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  variants={fadeUp} transition={{ delay: k * 0.05, duration: 0.4, ease }} className={cls} style={style}>
                  {inner}
                  <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: SPECTRAL }} />
                </motion.a>
              ) : (
                <div key={c.label} className={cls} style={style}>{inner}</div>
              );
            })}
          </motion.div>

          {/* message form (mailto) */}
          <motion.form onSubmit={send} variants={fadeUp} initial="hidden" whileInView="visible" viewport={view} transition={{ delay: 0.1, duration: 0.5, ease }}
            className="rounded-xl border p-6 flex flex-col gap-4" style={{ borderColor: C.line, background: C.panel }}>
            <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>send a message</p>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs" style={{ color: C.muted }}>Name</label>
              <input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" className={inputCls} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs" style={{ color: C.muted }}>Subject</label>
              <input id="subject" value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="What's this about?" className={inputCls} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs" style={{ color: C.muted }}>Message</label>
              <textarea id="message" rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell me what you're working on." className={`${inputCls} resize-none`} style={inputStyle} />
            </div>
            <button type="submit" disabled={!form.message}
              className="spec-btn flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-40"
              style={{ background: SPECTRAL, color: '#07080a' }}>
              <Send size={14} /> Open in email
            </button>
            <p className="text-[11px] text-center" style={{ color: C.dim }}>This opens your email app with the message ready to send.</p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
