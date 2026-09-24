import type {
  AboutProfile,
  Award,
  AwardLevel,
  BilingualText,
  ContactPoint,
  Credential,
  EducationEntry,
  Patent,
  Project,
  Publication,
  SkillCategory,
} from "@/src/data/profile";
import type { ProfileIdentity } from "@/src/data/profile/identity";

export interface PublicCareerIdentity extends ProfileIdentity {
  contacts: ContactPoint[];
}

/**
 * 求职信息助理语料。
 *
 * 规则引擎与外部模型兜底层共用同一份公开数据集，保证两侧口径一致。
 */
export interface CareerCorpus {
  identity: PublicCareerIdentity | null;
  /** 关于页公开资料：籍贯、通用研究方向、量化简介（bioSections） */
  about?: AboutProfile | null;
  education?: EducationEntry[];
  /** 证书与专利（证书条目含取证时间），供「证书资质」回答使用 */
  credentials?: Credential[];
  projects: Project[];
  publications?: Publication[];
  patents: Patent[];
  skills: SkillCategory[];
  awards: Award[];
  competitions?: Award[];
  awardLevelLabels?: Record<AwardLevel, BilingualText>;
  awardLevelOrder?: AwardLevel[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const CHAT_LIMITS: Readonly<{
  maxMessages: number;
  maxMessageCharacters: number;
  maxTotalCharacters: number;
}>;

export function parseChatMessages(body: unknown): ChatMessage[] | null;
export function getMessageLocale(message: string): "zh" | "en";
export function isPromptInjection(message: string): boolean;
/**
 * 规则引擎匹配：命中返回回答文本，未命中返回 null（由上层决定是否调用外部模型兜底）。
 * 提示词注入返回标准拒绝答复，不会被转发给外部模型。
 */
export function matchCareerReply(
  corpus: CareerCorpus,
  message: string
): string | null;
export function createCareerReply(
  corpus: CareerCorpus,
  message: string
): string;
/** 规则未命中且外部模型不可用时使用的友好兜底文案 */
export function getFriendlyFallback(locale: "zh" | "en"): string;
/** 把公开 Profile 数据整理成 RAG 上下文纯文本 */
export function buildProfileContext(
  corpus: CareerCorpus,
  locale: "zh" | "en"
): string;
