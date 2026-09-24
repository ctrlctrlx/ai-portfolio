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
    { label: "自我介绍", key: "introduction" },
    { label: "项目经历", key: "projects" },
    { label: "核心技能", key: "skills" },
    { label: "教育经历", key: "education" },
    { label: "研究方向", key: "research" },
    { label: "荣誉资质", key: "honors" },
  ],
  en: [
    { label: "Introduction", key: "introduction" },
    { label: "Project Experience", key: "projects" },
    { label: "Core Skills", key: "skills" },
    { label: "Education", key: "education" },
    { label: "Research Focus", key: "research" },
    { label: "Honors & Awards", key: "honors" },
  ],
};

const QUICK_PROMPTS: Record<string, Record<Lang, string>> = {
  introduction: {
    zh: "请做一个自我介绍",
    en: "Please introduce yourself",
  },
  projects: {
    zh: "介绍一下你的项目经历",
    en: "Tell me about your project experience",
  },
  skills: {
    zh: "你的核心技能是什么？",
    en: "What are your core skills?",
  },
  education: {
    zh: "请介绍你的教育经历",
    en: "Tell me about your education",
  },
  research: {
    zh: "你的研究方向是什么？",
    en: "What is your research focus?",
  },
  // 「论文信息」快捷入口与问答规则已整体移除：该类提问改为规则未命中后走 API 兜底
  honors: {
    zh: "有哪些荣誉资质？",
    en: "What honors and awards do you have?",
  },
};

/**
 * 开场白由服务端布局按当前 locale 组装后以纯字符串传入。
 *
 * 这里不再直接 import profile 数据层：ChatBox 是客户端组件，一旦在客户端
 * 引用 "@/src/data/profile"，整个双语 profile 数据集（about / projects /
 * publications 等全部中英文本）都会被序列化进客户端 chunk，使英文页面的
 * 资源包里出现大量中文字符。改为只传一句已解析好的问候语。
 */
const BUSY_MSG: Record<Lang, string> = {
  zh: "AI 助理正在忙碌，请稍后再试，或点击下方快捷按钮获取答案。",
  en: "AI is busy right now. Please try again later or use the quick buttons below.",
};

const NET_ERR: Record<Lang, string> = {
  zh: "网络异常，请稍后重试，或点击下方快捷按钮。",
  en: "Network error. Please retry or use quick buttons below.",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ChatBox({
  lang,
  greeting,
}: {
  lang: Lang;
  greeting: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Show greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [open, greeting, messages.length]);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Esc 关闭 + Tab 焦点陷阱 + 关闭后焦点回到触发按钮
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-career-assistant", handleOpen);
    return () => window.removeEventListener("open-career-assistant", handleOpen);
  }, []);

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
            messages: next
              .slice(-12)
              .map((m) => ({ role: m.role, content: m.content })),
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
        type="button"
        ref={toggleRef}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95 motion-reduce:transform-none sm:bottom-6 sm:right-6"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        aria-label={lang === "zh" ? "打开 AI 助理" : "Open AI assistant"}
        aria-expanded={open}
        aria-controls="portfolio-ai-assistant"
        title={lang === "zh" ? "AI 助理" : "AI assistant"}
      >
        {open ? (
          <ChevronDown size={20} aria-hidden="true" />
        ) : (
          <MessageCircle size={20} aria-hidden="true" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          id="portfolio-ai-assistant"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="portfolio-ai-assistant-title"
          className="fixed left-4 right-4 z-50 flex w-auto flex-col overflow-hidden rounded-2xl border shadow-2xl sm:left-auto sm:right-6 sm:w-96"
          style={{
            bottom: "5.5rem",
            // 下限 15rem 保证输入区在矮视口下仍可见可用
            height: "max(15rem, min(28rem, calc(100dvh - 7rem)))",
            background: "var(--card)",
            borderColor: "var(--card-border)",
          }}
        >
          {/* Header bar */}
          <div
            className="flex shrink-0 items-center justify-between border-b px-4 py-3"
            style={{ borderColor: "var(--card-border)" }}
          >
            <div className="flex items-center gap-2">
              <Bot size={16} style={{ color: "var(--accent)" }} aria-hidden="true" />
              <span
                id="portfolio-ai-assistant-title"
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                {lang === "zh" ? "求职信息助理" : "Career Assistant"}
              </span>
              <span
                className="rounded px-1.5 py-0.5 font-mono text-xs"
                style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
              >
                Profile
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--muted)" }}
              aria-label={lang === "zh" ? "关闭 AI 助理" : "Close AI assistant"}
              title={lang === "zh" ? "关闭" : "Close"}
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          {/* Message list */}
          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3"
            role="log"
            aria-live="polite"
            aria-label={lang === "zh" ? "对话记录" : "Conversation"}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "var(--accent)", color: "var(--accent-foreground)" }
                      : {
                          background: "var(--background)",
                          color: "var(--foreground)",
                          border: "1px solid var(--card-border)",
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" role="status">
                <div
                  className="rounded-2xl px-3 py-2 text-xs"
                  style={{
                    background: "var(--background)",
                    color: "var(--muted)",
                    border: "1px solid var(--card-border)",
                  }}
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
          <div className="flex shrink-0 flex-wrap gap-1.5 px-3 pb-2">
            {QUICK_QUESTIONS[lang].map((q) => (
              <button
                type="button"
                key={q.key}
                onClick={() => sendMessage(QUICK_PROMPTS[q.key][lang])}
                disabled={loading}
                className="rounded-full border px-2.5 py-1 text-xs transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
                style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="shrink-0 px-3 pb-3">
            <label htmlFor="portfolio-ai-question" className="sr-only">
              {lang === "zh" ? "向 AI 助理提问" : "Ask the AI assistant"}
            </label>
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2"
              style={{ background: "var(--background)", borderColor: "var(--card-border)" }}
            >
              <input
                id="portfolio-ai-question"
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
                  lang === "zh"
                    ? "可自由提问，或点击下方快捷问题"
                    : "Feel free to ask, or click quick questions below"
                }
                disabled={loading}
                maxLength={2000}
                className="flex-1 bg-transparent text-xs outline-none disabled:opacity-60"
                style={{ color: "var(--foreground)" }}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="shrink-0 transition-opacity disabled:opacity-30"
                style={{ color: "var(--accent)" }}
                aria-label={lang === "zh" ? "发送问题" : "Send question"}
                title={lang === "zh" ? "发送问题" : "Send question"}
              >
                <Send size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
