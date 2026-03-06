"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Lang = "zh" | "en";

const QUICK_QUESTIONS: Record<Lang, { label: string; key: string }[]> = {
  zh: [
    { label: "鱼类 Re-ID", key: "fish" },
    { label: "水下 VIO-SLAM", key: "vio" },
    { label: "核心技能", key: "skills" },
  ],
  en: [
    { label: "Fish Re-ID", key: "fish" },
    { label: "Underwater VIO-SLAM", key: "vio" },
    { label: "Core Skills", key: "skills" },
  ],
};

const QUICK_PROMPTS: Record<string, Record<Lang, string>> = {
  fish: {
    zh: "介绍一下你的鱼类 Re-ID 项目",
    en: "Tell me about your Fish Re-ID project",
  },
  vio: {
    zh: "介绍一下水下 VIO-SLAM 项目",
    en: "Tell me about your underwater VIO-SLAM project",
  },
  skills: {
    zh: "介绍你的核心技能栈",
    en: "What are your core technical skills?",
  },
};

const GREETING: Record<Lang, string> = {
  zh: "你好！我是杨冲的 AI 分身。请问您想了解哪个项目或技能？",
  en: "Hi! I'm Mingyuan Yang's AI avatar. What project or skill would you like to know about?",
};

const BUSY_MSG: Record<Lang, string> = {
  zh: "AI 助理正在忙碌，请稍后再试，或点击下方快捷按钮获取答案。",
  en: "AI is busy right now. Please try again later or use the quick buttons below.",
};

const NET_ERR: Record<Lang, string> = {
  zh: "网络异常，请稍后重试，或点击下方快捷按钮。",
  en: "Network error. Please retry or use quick buttons below.",
};

export default function ChatBox({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: GREETING[lang] }]);
    }
  }, [open, lang, messages.length]);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || loading) return;

      setInput("");
      const next: Message[] = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: AbortSignal.timeout(20_000),
        });

        if (res.status === 429) {
          setMessages([...next, { role: "assistant", content: BUSY_MSG[lang] }]);
          return;
        }

        const data = await res.json();
        const reply: string =
          data.content ?? data.message ?? (lang === "zh" ? "抱歉，暂时无法回答。" : "Sorry, unable to answer right now.");
        setMessages([...next, { role: "assistant", content: reply }]);
      } catch {
        setMessages([...next, { role: "assistant", content: NET_ERR[lang] }]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, lang]
  );

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ background: "var(--accent)" }}
        aria-label={lang === "zh" ? "打开 AI 助理" : "Open AI assistant"}
      >
        {open ? (
          <ChevronDown size={20} color="white" />
        ) : (
          <MessageCircle size={20} color="white" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
          style={{
            bottom: "5.5rem",
            height: "440px",
            background: "#0d1117",
            borderColor: "#30363d",
          }}
        >
          {/* Header bar */}
          <div
            className="px-4 py-3 flex items-center justify-between border-b shrink-0"
            style={{ borderColor: "#30363d" }}
          >
            <div className="flex items-center gap-2">
              <Bot size={16} color="#60a5fa" />
              <span className="text-sm font-semibold text-white">
                {lang === "zh" ? "AI 分身" : "AI Avatar"}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ background: "#161b22", color: "#60a5fa" }}
              >
                DeepSeek
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="transition-colors hover:text-white"
              style={{ color: "#6b7280" }}
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[88%] text-xs leading-relaxed px-3 py-2 rounded-2xl whitespace-pre-wrap break-words"
                  style={
                    msg.role === "user"
                      ? { background: "#1d4ed8", color: "#e0e7ff" }
                      : { background: "#1f2937", color: "#d1d5db" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="text-xs px-3 py-2 rounded-2xl"
                  style={{ background: "#1f2937", color: "#6b7280" }}
                >
                  <span className="animate-pulse">
                    {lang === "zh" ? "正在思考…" : "Thinking…"}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick question chips */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
            {QUICK_QUESTIONS[lang].map((q) => (
              <button
                key={q.key}
                onClick={() => sendMessage(QUICK_PROMPTS[q.key][lang])}
                disabled={loading}
                className="text-xs px-2.5 py-1 rounded-full border transition-colors hover:border-blue-500 hover:text-blue-400 disabled:opacity-40"
                style={{ borderColor: "#374151", color: "#9ca3af" }}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="px-3 pb-3 shrink-0">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 border"
              style={{ background: "#161b22", borderColor: "#30363d" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={
                  lang === "zh" ? "向 AI 分身提问…" : "Ask AI avatar…"
                }
                disabled={loading}
                className="flex-1 bg-transparent text-xs outline-none text-gray-200 disabled:opacity-60"
                style={{ color: "#d1d5db" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="shrink-0 transition-opacity disabled:opacity-30"
                style={{ color: "#60a5fa" }}
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
