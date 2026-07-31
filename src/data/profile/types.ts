export interface BilingualText {
  zh: string;
  en: string;
}

export type Visibility = "public" | "private" | "hidden";
export type VerificationStatus = "verified" | "pending" | "unavailable";

export interface EvidenceStatus {
  visibility: Visibility;
  verificationStatus: VerificationStatus;
  sourceId?: string;
  sourceNote?: string;
}

export interface SocialLink extends EvidenceStatus {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

export interface EducationEntry extends EvidenceStatus {
  id: string;
  institution: BilingualText;
  degree: BilingualText;
  major: BilingualText;
  gpa?: string;
  startDate: string;
  endDate: string;
  highlights: BilingualText[];
}

export interface Author {
  name: string;
  isHighlighted?: boolean;
}

export type PublicationStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "accepted"
  | "camera-ready"
  | "published"
  | "indexed";

export interface Publication extends EvidenceStatus {
  id: string;
  slug: string;
  title: BilingualText;
  authors: Author[];
  venue: BilingualText;
  year: number;
  abstract: BilingualText;
  tags: string[];
  doi?: string;
  arxivUrl?: string;
  status: PublicationStatus;
}

export type PatentStatus = "filed" | "under-review" | "granted";

export interface Patent extends EvidenceStatus {
  id: string;
  slug: string;
  title: BilingualText;
  inventors: string[];
  applicationNumber?: string;
  publicationNumber?: string;
  year?: number;
  status: PatentStatus;
  summary: BilingualText;
  publicUrl?: string;
}

export interface Project extends EvidenceStatus {
  id: string;
  slug: string;
  title: BilingualText;
  subtitle: BilingualText;
  featured: boolean;
  startDate: string;
  endDate: string;
  situation: BilingualText;
  task: BilingualText;
  action: BilingualText;
  result: BilingualText;
  coreSkill: string[];
  metrics: BilingualText[];
  interviewFocus: BilingualText[];
  githubUrl?: string;
  liveDemoUrl?: string;
  isInteractive?: boolean;
}

export interface Award extends EvidenceStatus {
  id: string;
  title: BilingualText;
  issuer: BilingualText;
  year: string;
}

export interface ResearchArea extends EvidenceStatus {
  id: string;
  slug: string;
  title: BilingualText;
  relatedProjectSlugs: string[];
}

export interface SkillEntry extends EvidenceStatus {
  id: string;
  name: BilingualText;
}

export interface SkillCategory extends EvidenceStatus {
  id: string;
  label: BilingualText;
  items: SkillEntry[];
}
