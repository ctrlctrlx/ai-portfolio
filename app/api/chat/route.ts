import { NextRequest, NextResponse } from "next/server";
import {
  education,
  identity,
  projects,
  publications,
} from "@/src/data/profile";

// ---------------------------------------------------------------------------
// Rate limiting — Vercel KV (Redis). Gracefully degrades in local dev when
// KV env vars are absent.
// ---------------------------------------------------------------------------

const RATE_LIMIT = 5;       // requests
const WINDOW_MS = 60_000;   // 1 minute
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARACTERS = 2_000;
const MAX_TOTAL_CHARACTERS = 8_000;

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const messages = (body as Record<string, unknown>).messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return null;
  }

  let totalCharacters = 0;
  const parsed: ChatMessage[] = [];

  for (const message of messages) {
    if (
      typeof message !== "object" ||
      message === null ||
      Array.isArray(message)
    ) {
      return null;
    }

    const { role, content } = message as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;

    const trimmedContent = content.trim();
    if (
      trimmedContent.length === 0 ||
      content.length > MAX_MESSAGE_CHARACTERS
    ) {
      return null;
    }

    totalCharacters += content.length;
    if (totalCharacters > MAX_TOTAL_CHARACTERS) return null;

    parsed.push({ role, content: trimmedContent });
  }

  return parsed;
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  // Skip rate limiting when KV is not configured (local dev)
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return { allowed: true, remaining: RATE_LIMIT };
  }

  try {
    const { kv } = await import("@vercel/kv");
    const key = `chat:ratelimit:${ip}`;
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // Lua script for atomic sliding-window rate limit
    const luaScript = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local windowStart = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])
      local expire = tonumber(ARGV[4])
      redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)
      local count = redis.call('ZCARD', key)
      if count < limit then
        redis.call('ZADD', key, now, now .. ':' .. math.random(1000000))
        redis.call('EXPIRE', key, expire)
        return {1, limit - count - 1}
      else
        return {0, 0}
      end
    `;

    const result = await kv.eval(
      luaScript,
      [key],
      [now.toString(), windowStart.toString(), RATE_LIMIT.toString(), "120"]
    ) as [number, number];

    return { allowed: result[0] === 1, remaining: result[1] };
  } catch {
    // KV error: fail open to avoid blocking users
    return { allowed: true, remaining: RATE_LIMIT };
  }
}

// ---------------------------------------------------------------------------
// Build the interview corpus from the verified profile data.
// ---------------------------------------------------------------------------

function buildSystemPrompt(): string {
  const projectsText = projects
    .map((p) => {
      return `
## ${p.title.zh} / ${p.title.en}
- 情境(Situation): ${p.situation.zh}
- 任务(Task): ${p.task.zh}
- 行动(Action): ${p.action.zh}
- 结果(Result): ${p.result.zh}
- 核心技术: ${p.coreSkill.join(", ")}
- 面试重点: ${p.interviewFocus.map((f) => f.zh).join(" | ")}
- 量化指标: ${p.metrics.map((m) => m.zh).join(", ")}
      `.trim();
    })
    .join("\n\n");

  const pubsText = publications
    .map((p) => `- ${p.title} (${p.year}) [${p.type}]: ${p.abstract.zh}`)
    .join("\n");

  return `你是"${identity.name.zh}"的专业技术面试助理，名字叫 "AI 分身"。
你的唯一职责是：帮助来访的 HR 和技术面试官深入了解候选人的技术能力、项目经历和研究成果。

---
## 候选人基本信息
- 姓名: ${identity.name.zh} (${identity.name.en})
- 定位: ${identity.tagline.zh}
- 所在地: ${identity.location.zh}
- 简介: ${identity.bio.zh}

---
## 核心项目经历 (STAR 法则)
${projectsText}

---
## 论文与专利
${pubsText}

---
## 行为准则 (CRITICAL — always follow)
1. **只讨论技术**：仅回答与候选人的技术能力、项目、研究、求职相关的问题。
2. **拒绝闲聊**：如果用户问无关话题（如"你好吗"、"讲个笑话"等），礼貌地说："我只能介绍候选人的技术背景，请问您想了解哪个项目或技能？"
3. **中英双语**：用户用中文则回中文，用英文则回英文。
4. **言简意赅**：每次回复 200 字以内，只引用公开资料明确提供的事实。
5. **引导深挖**：每次回复末尾可以建议继续了解资料中已经列出的项目、技能或教育经历。
6. **保护隐私**：不透露私人联系方式，不讨论薪资谈判。
7. **事实边界**：资料未提供的成果必须明确说明无法确认，禁止推断论文发表状态。
8. **禁止编造**：不得编造项目、指标、设备或奖项，不得把未来规划描述为已经完成的成果。`;
}

// ---------------------------------------------------------------------------
// Static fallback Q&A — generated from the verified public data
// ---------------------------------------------------------------------------

type StaticLocale = "zh" | "en";

const SAFE_FALLBACK: Record<StaticLocale, string> = {
  zh: "当前公开资料中没有足够信息支持这一结论。",
  en: "The currently available public information is insufficient to support that conclusion.",
};

function getStaticLocale(message: string): StaticLocale {
  return /[\u3400-\u9fff]/.test(message) ? "zh" : "en";
}

function buildProjectsReply(locale: StaticLocale): string {
  const projectLines = projects
    .map((project) => {
      return `• ${project.title[locale]} (${project.startDate}–${project.endDate})\n  ${project.result[locale]}`;
    })
    .join("\n\n");

  return locale === "zh"
    ? `${identity.name.zh}当前公开的项目经历：\n${projectLines}`
    : `${identity.name.en}'s currently listed project experience:\n${projectLines}`;
}

function buildSkillsReply(locale: StaticLocale): string {
  const skills = Array.from(
    new Set(projects.flatMap((project) => project.coreSkill))
  );
  const skillList = skills.map((skill) => `• ${skill}`).join("\n");

  return locale === "zh"
    ? `当前公开项目中列出的核心技能：\n${skillList}`
    : `Core skills listed in the current public projects:\n${skillList}`;
}

function buildEducationReply(locale: StaticLocale): string {
  const educationLines = education
    .map((entry) => {
      return `• ${entry.institution[locale]} — ${entry.degree[locale]} · ${entry.major[locale]} (${entry.startDate}–${entry.endDate})`;
    })
    .join("\n");

  return locale === "zh"
    ? `${identity.name.zh}当前公开的教育经历：\n${educationLines}`
    : `${identity.name.en}'s currently listed education:\n${educationLines}`;
}

function buildStaticReply(message: string): string {
  const locale = getStaticLocale(message);
  const normalized = message.trim().toLowerCase();

  if (
    normalized.includes("项目经历") ||
    normalized.includes("project experience")
  ) {
    return buildProjectsReply(locale);
  }

  if (
    normalized.includes("核心技能") ||
    normalized.includes("core skills")
  ) {
    return buildSkillsReply(locale);
  }

  if (
    normalized.includes("教育经历") ||
    normalized.includes("education")
  ) {
    return buildEducationReply(locale);
  }

  return SAFE_FALLBACK[locale];
}

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Extract client IP for rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // Rate limit check
  const { allowed, remaining } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "AI 助理正在忙碌，请稍后再试。" },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": "0" },
      }
    );
  }

  // Parse request body
  let messages: ChatMessage[];
  try {
    const body: unknown = await req.json();
    const parsedMessages = parseMessages(body);
    if (!parsedMessages) throw new Error("invalid messages");
    messages = parsedMessages;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Check for DeepSeek API key
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // Dev fallback: answer only from the verified public data
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
    const staticReply = buildStaticReply(lastMsg);

    return NextResponse.json(
      { role: "assistant", content: staticReply },
      { headers: { "X-RateLimit-Remaining": remaining.toString() } }
    );
  }

  // Call DeepSeek API
  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...messages.slice(-8), // keep last 8 messages for context
        ],
        max_tokens: 400,
        temperature: 0.7,
        stream: false,
      }),
      signal: AbortSignal.timeout(15_000), // 15s timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", response.status, errorText);

      if (response.status === 429 || response.status >= 500) {
        return NextResponse.json(
          { error: "api_unavailable", message: "AI 助理暂时不可用，请使用下方快捷问题。" },
          { status: 503 }
        );
      }
      throw new Error(`DeepSeek API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "抱歉，我暂时无法回答这个问题。";

    return NextResponse.json(
      { role: "assistant", content },
      { headers: { "X-RateLimit-Remaining": remaining.toString() } }
    );
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json(
        { error: "timeout", message: "AI 助理响应超时，请使用下方快捷问题。" },
        { status: 504 }
      );
    }
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "internal", message: "服务异常，请稍后重试。" },
      { status: 500 }
    );
  }
}
