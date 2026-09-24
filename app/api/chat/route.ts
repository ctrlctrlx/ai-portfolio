import { NextRequest, NextResponse } from "next/server";
import {
  awardLevelLabels,
  awardLevelOrder,
  publicAbout,
  publicAwards,
  publicCompetitions,
  publicCredentials,
  publicEducation,
  publicIdentity,
  publicPatents,
  publicProjects,
  publicPublications,
  publicSkills,
} from "@/src/data/profile";
import {
  matchCareerReply,
  parseChatMessages,
} from "@/src/lib/career-agent.mjs";
import {
  createDeepSeekReply,
  getFallbackReply,
} from "@/src/lib/deepseekAgent";

const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

/**
 * 求职信息助理语料。
 *
 * 双层架构：规则引擎负责高频问题精准秒答，外部模型（可选）仅在规则未命中时兜底；
 * 两侧共用同一份公开数据集，保证口径一致。
 */
const publicCareerCorpus = {
  identity: publicIdentity,
  about: publicAbout,
  education: publicEducation,
  credentials: publicCredentials,
  projects: publicProjects,
  publications: publicPublications,
  patents: publicPatents,
  skills: publicSkills,
  awards: publicAwards,
  competitions: publicCompetitions,
  awardLevelLabels,
  awardLevelOrder,
};

async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return { allowed: true, remaining: RATE_LIMIT };
  }

  try {
    const { kv } = await import("@vercel/kv");
    const key = `chat:ratelimit:${ip}`;
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
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
      end
      return {0, 0}
    `;

    const result = (await kv.eval(
      luaScript,
      [key],
      [now.toString(), windowStart.toString(), RATE_LIMIT.toString(), "120"]
    )) as [number, number];

    return { allowed: result[0] === 1, remaining: result[1] };
  } catch {
    return { allowed: true, remaining: RATE_LIMIT };
  }
}

export async function POST(request: NextRequest) {
  let messages;
  try {
    const body: unknown = await request.json();
    messages = parseChatMessages(body);
  } catch {
    messages = null;
  }

  if (!messages) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const { allowed, remaining } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "AI 助理正在忙碌，请稍后再试。" },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
    );
  }

  /**
   * 双层问答：
   * 1) 规则引擎优先：命中即返回（零成本、秒响应，高频问题不受外部模型影响）
   * 2) 规则未命中：调用外部模型做 RAG 增强回答
   * 3) 外部模型不可用（未配置密钥 / 超时 / 失败）：返回友好兜底文案
   *
   * 提示词注入由规则引擎直接拒绝，不会被转发给外部模型。
   */
  const question = messages[messages.length - 1].content;
  const ruleReply = matchCareerReply(publicCareerCorpus, question);
  const reply =
    ruleReply ?? (await createDeepSeekReply(publicCareerCorpus, question));
  const content = reply ?? getFallbackReply(question);

  return NextResponse.json(
    { role: "assistant", content },
    { headers: { "X-RateLimit-Remaining": remaining.toString() } }
  );
}
