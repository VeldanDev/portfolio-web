'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Zap } from 'lucide-react';

const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff', cyan: '#45e0d0',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';
const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

// ─── Static responses ─────────────────────────────────────────────────────────

const PATTERNS: { regex: RegExp; response: string }[] = [
  {
    regex: /project|built|scepter|spencer|work|portfolio|agent/i,
    response:
      "A few things I've shipped:\n\n• Scepter, a CLI on npm that checks whether an MCP server is alive, maintained, and safe before an agent trusts it.\n• SpencerWeb, a web vulnerability scanner mapped to the OWASP Top 10, with a dashboard and PDF reports.\n• An autonomous AI agent with 18 tools that runs real workflows on its own.\n• Specter 2.0, a CLI OSINT and recon framework.\n\nThe full list is on the /projects page.",
  },
  {
    regex: /stack|skill|tech|language|framework|tools|use|know/i,
    response:
      "My stack:\n\nLanguages: Python, TypeScript, JavaScript, PHP, C/C++, Bash, SQL\nAI: LLM agents, tool-use, TensorFlow, MCP\nSecurity: OSINT, recon, OWASP, Burp\nWeb: Next.js, React, Node, Prisma, Supabase, Linux, Docker\n\nThe full breakdown is on /about.",
  },
  {
    regex: /intern|available|hire|opportunit|open.?to|looking|job|work with/i,
    response:
      "Yes, I'm open to roles and internships in AI engineering, cybersecurity, and software development.\n\nI ship real tools, not just demos, and I learn fast. If you have something that fits, reach me on the /contact page or on WhatsApp.",
  },
  {
    regex: /contact|email|reach|message|dm|whatsapp|talk.?to/i,
    response:
      "You can reach me at:\n\n• GitHub: github.com/VeldanDev\n• TikTok: @veldorable\n• Or the contact form at /contact\n\nI usually reply within a day.",
  },
  {
    regex: /study|university|college|school|politeknik|medan|who|about/i,
    response:
      "I'm Aditya, an AI and security engineer based in Medan, Indonesia. I build autonomous agents, security tooling, and full-stack software.\n\nI'm a Computer Engineering student at Politeknik Negeri Medan, which gave me the low-level grounding, and mostly self-taught by shipping. More on /about.",
  },
];

const DEFAULT_RESPONSE =
  "I don't have a scripted answer for that one yet. These replies are still rule-based, not a live model.\n\nTry asking about my projects, my stack, whether I'm open to work, or how to reach me.";

const SUGGESTED = [
  "What have you built?",
  "What's your stack?",
  "Are you open to work?",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function match(input: string): string {
  for (const { regex, response } of PATTERNS) {
    if (regex.test(input)) return response;
  }
  return DEFAULT_RESPONSE;
}

// ─── Typing text component (for bot messages only) ────────────────────────────

function TypingBotMessage({
  content,
  animate,
}: {
  content: string;
  animate: boolean;
}) {
  const [displayed, setDisplayed] = useState(animate ? '' : content);

  useEffect(() => {
    if (!animate) { setDisplayed(content); return; }
    let i = 0;
    setDisplayed('');
    const tick = setInterval(() => {
      i++;
      setDisplayed(content.slice(0, i));
      if (i >= content.length) clearInterval(tick);
    }, 16);
    return () => clearInterval(tick);
  }, [content, animate]);

  return (
    <span className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: C.text }}>
      {displayed}
      {animate && displayed.length < content.length && (
        <span
          className="inline-block w-[2px] h-[0.9em] align-middle ml-[2px] animate-pulse"
          style={{ background: C.cyan }}
        />
      )}
    </span>
  );
}

// ─── Typing indicator (three pulsing dots) ────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2"
    >
      <span
        className="flex items-center justify-center w-6 h-6 rounded-full border shrink-0"
        style={{ borderColor: C.line2, background: C.panel2 }}
      >
        <Bot size={11} strokeWidth={1.5} style={{ color: C.violet }} />
      </span>
      <div
        className="flex gap-1 px-3 py-2.5 rounded-lg rounded-bl-sm border"
        style={{ borderColor: C.line, background: C.panel }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ background: C.dim }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SmartTalkPage() {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages or typing state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: userId, role: 'user', content: trimmed }]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay then respond
    setTimeout(() => {
      const response = match(trimmed);
      const botId = crypto.randomUUID();
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: botId, role: 'bot', content: response }]);
      setAnimatingId(botId);
      // Clear animating flag after typing completes
      setTimeout(() => setAnimatingId(null), response.length * 16 + 800);
    }, 600 + Math.random() * 400);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  const isEmpty = messages.length === 0;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100dvh' }}>
      <div className="px-6 py-14 md:py-20 max-w-2xl mx-auto flex flex-col" style={{ fontFamily: 'var(--font-sans-body)' }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8"
        >
          <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>
            / smart-talk
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Smart Talk
          </h1>
          <p className="text-sm" style={{ color: C.muted }}>Ask me anything about my work.</p>
        </motion.div>

        {/* ── Chat container ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="flex flex-col flex-1 min-h-[520px] rounded-xl border overflow-hidden"
          style={{ borderColor: C.line, background: C.panel }}
        >
          {/* Status bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: C.line, background: C.panel2 }}
          >
            <span className="spec-pulse w-1.5 h-1.5 rounded-full" style={{ background: C.cyan }} />
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>
              aditya.dev · rule-based
            </span>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

            {/* Empty state + suggested chips */}
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-6 py-12"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full border"
                  style={{ borderColor: C.line2, background: C.panel2 }}
                >
                  <Bot size={20} strokeWidth={1.5} style={{ color: C.violet }} />
                </div>
                <div className="text-center">
                  <p className="text-sm mb-1" style={{ color: C.text }}>Hi, I&apos;m Aditya&apos;s assistant.</p>
                  <p className="text-xs" style={{ color: C.muted }}>Ask me anything, or pick a suggestion below.</p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  {SUGGESTED.map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                      onClick={() => send(q)}
                      className="spec-card text-left px-3 py-2.5 text-xs rounded-md border transition-colors duration-150"
                      style={{ borderColor: C.line2, background: C.panel2, color: C.muted }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex items-end gap-2 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 border"
                    style={
                      msg.role === 'user'
                        ? { borderColor: `${C.cyan}44`, background: `${C.cyan}14` }
                        : { borderColor: C.line2, background: C.panel2 }
                    }
                  >
                    {msg.role === 'user' ? (
                      <User size={11} strokeWidth={1.5} style={{ color: C.cyan }} />
                    ) : (
                      <Bot size={11} strokeWidth={1.5} style={{ color: C.violet }} />
                    )}
                  </span>

                  {/* Bubble */}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed border ${
                      msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { borderColor: `${C.cyan}33`, background: `${C.cyan}0d`, color: C.text }
                        : { borderColor: C.line, background: C.panel2 }
                    }
                  >
                    {msg.role === 'bot' ? (
                      <TypingBotMessage
                        content={msg.content}
                        animate={animatingId === msg.id}
                      />
                    ) : (
                      <span className="whitespace-pre-wrap text-sm" style={{ color: C.text }}>
                        {msg.content}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* Suggested chips — shown after first message */}
          {!isEmpty && (
            <div
              className="flex gap-2 px-4 py-2 border-t overflow-x-auto scrollbar-none"
              style={{ borderColor: C.line }}
            >
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={isTyping}
                  className="shrink-0 px-2.5 py-1 text-[10px] rounded border disabled:opacity-30 transition-colors duration-150 whitespace-nowrap"
                  style={{ borderColor: C.line2, background: C.panel2, color: C.muted }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 border-t"
            style={{ borderColor: C.line }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              disabled={isTyping}
              className="flex-1 px-3 py-2 text-sm rounded-md outline-none disabled:opacity-40 transition-colors duration-150"
              style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.text }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="spec-btn flex items-center justify-center w-9 h-9 rounded-md shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: SPECTRAL, color: '#07080a' }}
            >
              <Send size={14} strokeWidth={1.5} />
            </button>
          </form>
        </motion.div>

        {/* ── Disclaimer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="flex items-center justify-center gap-1.5 mt-4 text-[11px]"
          style={{ color: C.dim }}
        >
          <Zap size={11} strokeWidth={1.5} />
          Rule-based for now. Live AI is on the way.
        </motion.p>
      </div>
    </div>
  );
}
