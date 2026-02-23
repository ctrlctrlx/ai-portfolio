import { NextRequest, NextResponse } from "next/server";
import { resumeData } from "@/src/data/resumeData";

// ---------------------------------------------------------------------------
// Rate limiting — Vercel KV (Redis). Gracefully degrades in local dev when
// KV env vars are absent.
// ---------------------------------------------------------------------------

const RATE_LIMIT = 5;       // requests
const WINDOW_MS = 60_000;   // 1 minute

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
// Build system prompt from resumeData — the interview corpus
// ---------------------------------------------------------------------------

function buildSystemPrompt(): string {
  const { personalInfo, projects, publications } = resumeData;

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

  return `你是"${personalInfo.name.zh}"的专业技术面试助理，名字叫 "AI 分身"。
你的唯一职责是：帮助来访的 HR 和技术面试官深入了解候选人的技术能力、项目经历和研究成果。

---
## 候选人基本信息
- 姓名: ${personalInfo.name.zh} (${personalInfo.name.en})
- 定位: ${personalInfo.tagline.zh}
- 所在地: ${personalInfo.location.zh}
- 简介: ${personalInfo.bio.zh}

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
4. **言简意赅**：每次回复 200 字以内，重点突出量化指标。
5. **引导深挖**：每次回复末尾附上一个追问建议（如"您是否想深入了解 INT8 量化的精度优化方案？"）。
6. **保护隐私**：不透露私人联系方式（邮箱已在页面展示），不讨论薪资谈判。`;
}

// ---------------------------------------------------------------------------
// Static fallback Q&A — used when rate limited or API unavailable
// ---------------------------------------------------------------------------

const STATIC_QA: Record<string, string> = {
  fish_reid: `🐟 鱼类 Re-ID 项目亮点：
• 检测骨干: YOLOv11n + 结构化通道剪枝（L1范数），参数量压缩 60%
• 加速方案: TensorRT 8 + INT8 量化 → 23 FPS（较基线 3.7×↑）
• 跟踪器: BoT-SORT，针对鱼类外观相似场景调优 ReID 权重
• 最终指标: mAP@50=87.6%（+5.2%），ID Switch 率仅 3.1%
• 部署平台: NVIDIA Jetson Nano 4GB
📌 论文已录用至 IEEE Internet of Things Journal。`,

  vio_slam: `🤖 水下 VIO-SLAM 项目亮点：
• 框架: ORB-SLAM3 + IMU 预积分（紧耦合）
• 前端增强: 暗通道先验去雾，提升水下散射光照下特征提取鲁棒性
• 噪声标定: Allan 方差分析，重新标定水下振动 IMU 噪声参数
• 后端优化: g2o 关键帧位姿图优化
• 最终精度: ATE RMSE = 0.043m（目标 ≤0.05m）
• 技术生态: ROS2 Humble，封装为可复用节点`,

  skills: `💡 核心技能栈：
• 算法方向: 目标检测/Re-ID(YOLOv11/BoT-SORT)、VIO/SLAM(ORB-SLAM3)
• 深度学习: PyTorch、模型压缩(剪枝/量化)、TensorRT 部署
• 边缘端: NVIDIA Jetson Nano、CUDA Streams、INT8/FP16推理
• 机器人: ROS2、IMU预积分、g2o位姿优化
• 全栈Web: Next.js 14 App Router、TypeScript、Tailwind CSS、Redis`,
};

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
  let messages: { role: string; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("invalid messages");
    }
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Check for DeepSeek API key
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // Dev fallback: echo a helpful static message
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
    let staticReply = "您好！我是杨明远的 AI 分身。请问您想了解哪个项目？\n\n快捷问题：\n• 鱼类Re-ID项目\n• VIO-SLAM项目\n• 核心技能栈";

    if (lastMsg.includes("鱼") || lastMsg.includes("reid") || lastMsg.includes("fish")) {
      staticReply = STATIC_QA.fish_reid;
    } else if (lastMsg.includes("slam") || lastMsg.includes("vio") || lastMsg.includes("水下")) {
      staticReply = STATIC_QA.vio_slam;
    } else if (lastMsg.includes("技能") || lastMsg.includes("skill") || lastMsg.includes("技术")) {
      staticReply = STATIC_QA.skills;
    }

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
