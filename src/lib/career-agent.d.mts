import type {
  Award,
  ContactPoint,
  EducationEntry,
  Patent,
  Project,
  Publication,
  ResearchArea,
  SkillCategory,
} from "@/src/data/profile";
import type { ProfileIdentity } from "@/src/data/profile/identity";

export interface PublicCareerIdentity extends ProfileIdentity {
  contacts: ContactPoint[];
}

export interface CareerCorpus {
  identity: PublicCareerIdentity | null;
  education: EducationEntry[];
  research: ResearchArea[];
  projects: Project[];
  publications: Publication[];
  patents: Patent[];
  skills: SkillCategory[];
  awards: Award[];
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
export function createCareerReply(
  corpus: CareerCorpus,
  message: string
): string;
