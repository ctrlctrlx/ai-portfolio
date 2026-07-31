import { NextRequest, NextResponse } from "next/server";
import {
  publicAwards,
  publicEducation,
  publicIdentity,
  publicPatents,
  publicProjects,
  publicPublications,
  publicResearchAreas,
  publicSkills,
} from "@/src/data/profile";
import {
  createCareerReply,
  parseChatMessages,
} from "@/src/lib/career-agent.mjs";

const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

const publicCareerCorpus = {
  identity: publicIdentity,
  education: publicEducation,
  research: publicResearchAreas,
  projects: publicProjects,
  publications: publicPublications,
  patents: publicPatents,
  skills: publicSkills,
  awards: publicAwards,
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

  const reply = createCareerReply(
    publicCareerCorpus,
    messages[messages.length - 1].content
  );
  return NextResponse.json(
    { role: "assistant", content: reply },
    { headers: { "X-RateLimit-Remaining": remaining.toString() } }
  );
}
