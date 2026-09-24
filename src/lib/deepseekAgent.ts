import type { CareerCorpus } from "@/src/lib/career-agent.mjs";
import {
  buildProfileContext,
  getFriendlyFallback,
  getMessageLocale,
} from "@/src/lib/career-agent.mjs";

/**
 * DeepSeek 兜底回答层（仅服务端）。
 *
 * 架构定位：本模块**只在规则引擎未命中时**被调用，属于兜底层，不参与高频问答。
 *
 * 安全约定：
 * - API 密钥只从服务端环境变量 `DEEPSEEK_API_KEY` 读取，未使用 NEXT_PUBLIC_ 前缀，
 *   因此不会进入客户端 bundle；密钥缺失时直接返回 null（上层回退到友好兜底文案）。
 * - 不记录、不返回任何密钥内容；失败日志只记录状态与原因类别。
 * - 不重试：网络异常/超时立即放弃，避免阻塞页面响应。
 */

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";
/** 单次请求超时（毫秒）：超时即降级到规则兜底文案 */
const REQUEST_TIMEOUT_MS = 3_000;
/** 兜底回答的长度上限，避免长文输出影响阅读与成本 */
const MAX_REPLY_CHARACTERS = 800;

/** 系统提示词：把回答严格约束在公开资料与求职主题内 */
const SYSTEM_PROMPT = [
  "你是「求职信息助理」，只回答与候选人求职相关的问题。",
  "严格遵守以下规则：",
  "1. 关于候选人的个人相关信息（经历、项目、技能、荣誉、联系方式等）必须严格基于下方提供的公开资料，禁止编造、推测或补充资料中没有的内容。",
  "2. 院校属性、行业常识等公共事实可以据实回答；不确定的内容必须说明不确定，不得猜测。",
  "3. 回答必须围绕求职主题；与求职无关的问题请礼貌拒绝，并引导回求职相关话题。",
  "4. 提问为中文时用中文回答，提问为英文时用英文回答；语言简洁专业。",
  "5. 不得输出任何隐私信息或资料中没有的数据。",
  "6. 回答使用简短要点式结构，避免长段落。",
  // 聊天界面按纯文本渲染（whitespace-pre-wrap，不解析 Markdown），
  // 因此必须要求模型输出纯文本，否则 ** 与 - 会原样显示给用户。
  "7. 只输出纯文本，不要使用 Markdown 标记（如 **、##、- 、`）；列表项请以「•」开头。",
].join("\n");

function getApiKey(): string | null {
  const key = process.env.DEEPSEEK_API_KEY;
  return typeof key === "string" && key.trim().length > 0 ? key.trim() : null;
}

/**
 * 是否已配置外部模型（供上层判断是否处于「纯规则引擎模式」）。
 */
export function isDeepSeekConfigured(): boolean {
  return getApiKey() !== null;
}

/**
 * 调用 DeepSeek 生成兜底回答。
 *
 * @returns 回答文本；未配置密钥 / 超时 / 调用失败 / 返回异常时返回 null
 */
export async function createDeepSeekReply(
  corpus: CareerCorpus,
  message: string
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const locale = getMessageLocale(message);
  const profileContext = buildProfileContext(corpus, locale);

  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        temperature: 0.2,
        max_tokens: 600,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `公开资料如下：\n\n${profileContext}\n\n用户提问：${message}`,
          },
        ],
      }),
      // 超时即放弃并降级；signal 同时阻止底层继续占用连接
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      // 只记录状态码与业务错误码，不记录密钥或响应正文
      console.error(
        `[career-assistant] deepseek request failed: status=${response.status}`
      );
      return null;
    }

    const data: unknown = await response.json();
    const content = extractContent(data);
    if (!content) {
      console.error("[career-assistant] deepseek returned empty content");
      return null;
    }

    return content.slice(0, MAX_REPLY_CHARACTERS);
  } catch (error) {
    // 超时（TimeoutError/AbortError）与网络异常都不重试，直接降级
    const name = error instanceof Error ? error.name : "unknown";
    console.error(`[career-assistant] deepseek call degraded: ${name}`);
    return null;
  }
}

/**
 * 从 DeepSeek 响应中取出首个候选文本；结构异常时返回 null。
 */
function extractContent(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0];
  if (typeof first !== "object" || first === null) return null;
  const message = (first as { message?: unknown }).message;
  if (typeof message !== "object" || message === null) return null;
  const content = (message as { content?: unknown }).content;
  if (typeof content !== "string") return null;
  const trimmed = content.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * 兜底文案：规则未命中且外部模型不可用时使用。
 */
export function getFallbackReply(message: string): string {
  return getFriendlyFallback(getMessageLocale(message));
}
