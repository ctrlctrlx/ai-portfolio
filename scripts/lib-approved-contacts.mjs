import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

/**
 * 公开联系方式白名单 —— 手机号隐私门禁的唯一放行来源。
 *
 * 背景：本人明确授权在求职作品集中公开手机号，因此以下位置允许出现该号码：
 *   1. src/data/profile/identity.ts        —— 联系方式数据层
 *   2. public/杨冲个人简历.pdf              —— 本人提供的正式版简历（全站唯一官方简历文件）
 *
 * 除上述位置外，任何 app/、src/、content/、public/ 中的文本文件都不得出现手机号；
 * 新增放行位置必须同时修改本文件，并同步更新 AGENTS.md 的隐私条款说明。
 */
export const APPROVED_EMAIL = "yangc202706@163.com";
export const APPROVED_PHONE = "18716985140";

/**
 * 已授权公开的籍贯。
 *
 * 背景：本人先前要求全站移除籍贯，verify-profile-data.mjs 因此以 blanket ban
 * （正则匹配「籍贯」或 Chongqing）拦截该字段。现本人重新授权公开籍贯（重庆），
 * 因此在此集中声明授权值：verify-profile-data.mjs 放行该值，
 * 其它籍贯值或来源仍然拦截。新增/撤销授权只需改这一处，保持可审计。
 */
export const APPROVED_NATIVE_PLACE = Object.freeze({
  zh: "重庆",
  en: "Chongqing",
});

/** 允许包含已批准手机号的文件（仓库相对路径，POSIX 分隔符） */
export const PHONE_APPROVED_FILES = new Set([
  "src/data/profile/identity.ts",
  "public/杨冲个人简历.pdf",
]);

/**
 * 允许包含已批准邮箱的文件。
 * 邮箱仍保持「全站只出现一次」的纪律，仅数据层可写。
 */
export const EMAIL_APPROVED_FILES = new Set(["src/data/profile/identity.ts"]);

const PHONE_PATTERN = /\b1[3-9]\d{9}\b/g;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

/** 返回文本中出现的手机号（去重） */
export function findPhoneNumbers(text) {
  return [...new Set(text.match(PHONE_PATTERN) ?? [])];
}

/** 返回文本中出现的邮箱（去重） */
export function findEmails(text) {
  return [...new Set(text.match(EMAIL_PATTERN) ?? [])];
}

/**
 * 判断给定文件内容是否含未批准手机号。
 * 已批准号码本身始终放行，其它号码一律视为违规。
 */
export function hasUnapprovedPhoneNumber(text) {
  return findPhoneNumbers(text).some((value) => value !== APPROVED_PHONE);
}

/**
 * 提取 PDF 文本，用于对可下载 PDF 做同样的隐私扫描。
 * 优先使用 pdftotext（-layout 保留版式）；缺失时回退到常见的 Python 绑定。
 *
 * 返回 { text, ok, reason }：
 * - ok=true  —— 成功提取到文字，可做完整审计
 * - ok=false —— 当前环境没有可用的 PDF 文字提取器（reason="no-pdf-text-extractor"）
 *              或文件缺失。校验脚本应据此给出提示并退回字节级扫描，
 *              而不是在缺少外部工具的机器上直接判定失败。
 */
export function extractPdfText(pdfPath) {
  if (!existsSync(pdfPath)) {
    return { text: "", ok: false, reason: "pdf-missing" };
  }

  try {
    const output = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return { text: output, ok: true, reason: "pdftotext" };
  } catch {
    // pdftotext 不可用，尝试 Python 绑定
  }

  const script = [
    "import sys",
    "try:",
    "    from pypdf import PdfReader",
    "except Exception:",
    "    try:",
    "        from PyPDF2 import PdfReader",
    "    except Exception:",
    "        sys.exit(2)",
    "r = PdfReader(sys.argv[1])",
    "print(''.join((p.extract_text() or '') for p in r.pages))",
  ].join("\n");

  try {
    const output = execFileSync("python", ["-c", script, pdfPath], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return { text: output, ok: true, reason: "python-pypdf" };
  } catch {
    return { text: "", ok: false, reason: "no-pdf-text-extractor" };
  }
}

/** 读取文本文件；文件不存在时返回空串 */
export function readTextFile(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
}

/**
 * 无文字提取器时的兜底：按字节扫描 PDF 中未压缩的文本内容。
 * 覆盖未加密、正文未压缩的常见简历 PDF（文字会以字面量出现）。
 * 注意：正文若被 FlateDecode 压缩则扫不到，此时只能依赖 extractPdfText。
 */
export function scanPdfRawText(pdfPath) {
  if (!existsSync(pdfPath)) return "";
  return readFileSync(pdfPath).toString("latin1");
}
