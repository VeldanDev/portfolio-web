'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Zap } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

// ─── Static responses ─────────────────────────────────────────────────────────

const PATTERNS: { regex: RegExp; response: string }[] = [
  {
    regex: /project|built|shift.?drive|work|portfolio/i,
    response:
      "Here's what I've built so far:\n\n• Shift Drives — A full-stack digital agency platform built with Next.js. Features 132+ templates, a tiered pricing system, and a WhatsApp-integrated consultation flow. Live at shift-drives.vercel.app\n\nMore projects are in the works — currently building IoT and networking tools. Check the /projects page for the full list.",
  },
  {
    regex: /stack|skill|tech|language|framework|tools|use|know/i,
    response:
      "My current tech stack:\n\nLanguages: Python, C/C++, TypeScript, Bash\nFrameworks: Next.js, React, FastAPI\nTools: Linux, Git, Docker, Wireshark, VS Code, Tinkercad\nHardware: ESP32, Raspberry Pi, Arduino\n\nCurrently learning: Rust, Kubernetes, Reverse Engineering.\n\nHead to /about for the full breakdown.",
  },
  {
    regex: /intern|available|hire|opportunit|open.?to|looking/i,
    response:
      "Yes — I'm actively looking for internship opportunities!\n\nI'm a Computer Engineering student at Politeknik Negeri Medan with hands-on experience in embedded systems, networking, and full-stack web development.\n\nIf you have an opportunity that fits, reach out via the /contact page or WhatsApp at +62 895-328-615-374.",
  },
  {
    regex: /contact|email|reach|message|dm|whatsapp|talk.?to/i,
    response:
      "You can reach me through:\n\n• WhatsApp: +62 895-328-615-374\n• GitHub: github.com/VeldanDev\n• TikTok: @veldorable\n• Or use the contact form at /contact\n\nI typically respond within 24 hours.",
  },
  {
    regex: /study|university|college|school|politeknik|medan/i,
    response:
      "I'm currently studying Computer Engineering at Politeknik Negeri Medan, Indonesia.\n\nMy coursework spans embedded systems, computer networking, and software engineering. Outside of class I build projects, break things, and document what I learn.",
  },
];

const DEFAULT_RESPONSE =
  "I don't have a specific answer for that yet — my responses are still static.\n\nTry asking about my projects, tech stack, internship availability, or how to contact me. AI-powered responses are coming soon!";

const SUGGESTED = [
  "What projects have you built?",
  "What's your tech stack?",
  "Are you available for internship?",
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
    <span className="whitespace-pre-wrap text-sm leading-relaxed text-[#f1f1f1]">
      {displayed}
      {animate && displayed.length < content.length && (
        <span className="inline-block w-[2px] h-[0.9em] align-middle ml-[2px] bg-[#4ade80] animate-pulse" />
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
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#1f1f1f] shrink-0">
        <Bot size={11} strokeWidth={1.5} className="text-[#4ade80]" />
      </span>
      <div className="flex gap-1 px-3 py-2.5 rounded-lg rounded-bl-sm border border-[#1f1f1f] bg-[#0a0a0a]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1 h-1 rounded-full bg-[#6b7280]"
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
    <div className="min-h-screen px-6 py-14 md:py-20 max-w-2xl mx-auto flex flex-col">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mb-8"
      >
        <p className="text-[10px] uppercase tracking-widest text-[#3d3d3d] mb-2">/ smart-talk</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f1f1f1] mb-3">
          Smart Talk
        </h1>
        <p className="text-sm text-[#6b7280]">Ask me anything about my work.</p>
      </motion.div>

      {/* ── Chat container ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        className="flex flex-col flex-1 min-h-[520px] rounded-lg border border-[#1f1f1f] bg-[#111111] overflow-hidden"
      >
        {/* Status bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f1f1f] bg-[#0d0d0d]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-[10px] tracking-widest text-[#3d3d3d] uppercase">
            aditya.dev — static responses
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
              <div className="flex items-center justify-center w-12 h-12 rounded-full
                              border border-[#1f1f1f] bg-[#0a0a0a]">
                <Bot size={20} strokeWidth={1.5} className="text-[#4ade80]" />
              </div>
              <div className="text-center">
                <p className="text-sm text-[#f1f1f1] mb-1">Hi, I&apos;m Aditya&apos;s assistant.</p>
                <p className="text-xs text-[#6b7280]">Ask me anything — or pick a suggestion below.</p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {SUGGESTED.map((q, i) => (
                  <motion.button
                    key={q}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                    onClick={() => send(q)}
                    className="text-left px-3 py-2.5 text-xs rounded-md border border-[#1f1f1f]
                               bg-[#0a0a0a] text-[#6b7280] hover:text-[#f1f1f1] hover:border-[#2a2a2a]
                               transition-colors duration-150"
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
                  className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0
                              border ${
                                msg.role === 'user'
                                  ? 'border-[#4ade80]/30 bg-[#4ade80]/10'
                                  : 'border-[#1f1f1f] bg-[#1a1a1a]'
                              }`}
                >
                  {msg.role === 'user' ? (
                    <User size={11} strokeWidth={1.5} className="text-[#4ade80]" />
                  ) : (
                    <Bot size={11} strokeWidth={1.5} className="text-[#4ade80]" />
                  )}
                </span>

                {/* Bubble */}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm border border-[#4ade80]/20 bg-[#4ade80]/5 text-[#f1f1f1]'
                      : 'rounded-bl-sm border border-[#1f1f1f] bg-[#0a0a0a]'
                  }`}
                >
                  {msg.role === 'bot' ? (
                    <TypingBotMessage
                      content={msg.content}
                      animate={animatingId === msg.id}
                    />
                  ) : (
                    <span className="whitespace-pre-wrap text-sm text-[#f1f1f1]">
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
          <div className="flex gap-2 px-4 py-2 border-t border-[#1f1f1f] overflow-x-auto
                          scrollbar-none">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={isTyping}
                className="shrink-0 px-2.5 py-1 text-[10px] rounded border border-[#1f1f1f]
                           bg-[#0a0a0a] text-[#6b7280] hover:text-[#f1f1f1] hover:border-[#2a2a2a]
                           disabled:opacity-30 transition-colors duration-150 whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-3 border-t border-[#1f1f1f]"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={isTyping}
            className="flex-1 px-3 py-2 text-sm bg-[#0a0a0a] border border-[#1f1f1f] rounded-md
                       text-[#f1f1f1] placeholder-[#3d3d3d] outline-none
                       focus:border-[#4ade80]/40 focus:ring-1 focus:ring-[#4ade80]/10
                       disabled:opacity-40 transition-colors duration-150"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex items-center justify-center w-9 h-9 rounded-md border
                       border-[#4ade80]/30 bg-[#4ade80]/10 text-[#4ade80]
                       hover:bg-[#4ade80]/20 hover:border-[#4ade80]/50
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors duration-150 shrink-0"
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
        className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-[#3d3d3d]"
      >
        <Zap size={11} strokeWidth={1.5} />
        Powered by static responses — AI integration coming soon
      </motion.p>
    </div>
  );
}
