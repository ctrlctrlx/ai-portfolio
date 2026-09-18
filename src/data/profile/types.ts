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

export type ContactKind = "email" | "website" | "github";

export interface ContactPoint extends EvidenceStatus {
  id: string;
  kind: ContactKind;
  label: BilingualText;
  value: string;
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
  /** 作者顺序，从 1 开始 */
  order: number;
  /** 是否为本人（本人姓名唯一来源是 identity.ts，此处不重复写姓名） */
  isCandidate?: boolean;
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

/** 论文类型：EI 会议 / 期刊 / 预印本等 */
export type PublicationType = "ei-conference" | "conference" | "journal" | "preprint";

export interface Publication extends EvidenceStatus {
  id: string;
  slug: string;
  title: BilingualText;
  authors: Author[];
  venue: BilingualText;
  year: number;
  /** 发表年月，形如 "2026.05"；用于按时间展示 */
  month?: string;
  publicationType?: PublicationType;
  /** 本人在该论文中的作者身份，例如「第一作者」 */
  authorRole?: BilingualText;
  abstract: BilingualText;
  /** 核心创新点，用于「学术成果」板块的单句概述 */
  coreContribution?: BilingualText;
  /** 论文中报告的量化指标 */
  metrics?: BilingualText[];
  /** 关联的公开项目 slug，用于展示「项目成果落地」 */
  relatedProjectSlugs?: string[];
  tags: string[];
  doi?: string;
  arxivUrl?: string;
  status: PublicationStatus;
}

export type PatentType = "utility-model";

export interface Patent extends EvidenceStatus {
  id: string;
  title: BilingualText;
  type: PatentType;
  patentNumber: string;
  publicationNumber: string;
  applicationDate: string;
  grantDate: string;
  inventorOrder: number;
  role: BilingualText;
  stageLabel: BilingualText;
}

/** 项目展示图片：仅保存 public 下的相对路径与图注 */
export interface ProjectImage {
  id: string;
  /** public 下的相对路径，例如 /images/projects/project-1/overview.jpg */
  src: string;
  caption: BilingualText;
  alt: BilingualText;
}

/** 项目相关文档：仅保存 public 下的相对路径与元信息 */
export interface ProjectDocument {
  id: string;
  title: BilingualText;
  /** 文档类型标签，例如「设计文档」「实验报告」「操作规范」 */
  tag: BilingualText;
  /** public 下的相对路径，例如 /docs/report-rfid-vision-device.pdf */
  pdfUrl: string;
}

export interface Project extends EvidenceStatus {
  id: string;
  slug: string;
  title: BilingualText;
  subtitle: BilingualText;
  /** 本人在项目中的角色，例如「核心研发」「项目负责人」 */
  role: BilingualText;
  featured: boolean;
  startDate: string;
  endDate: string;
  situation: BilingualText;
  task: BilingualText;
  action: BilingualText;
  result: BilingualText;
  coreSkill: string[];
  /** 卡片与详情页底部展示的技术标签（与简历上的技能描述分开维护） */
  techTags: string[];
  /** 卡片上与 metrics 并列展示的核心亮点（比 metrics 更强调业务价值） */
  highlights: BilingualText[];
  metrics: BilingualText[];
  interviewFocus: BilingualText[];
  /** 项目展示图片（仅详情页渲染，首页预览卡片不使用） */
  images: ProjectImage[];
  /** 相关文档下载（仅详情页渲染，首页预览卡片不使用） */
  documents: ProjectDocument[];
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

/** 同一分类下的逻辑分组，对应简历中分号分隔的技能簇 */
export interface SkillGroup {
  id: string;
  label: BilingualText;
  items: SkillEntry[];
}

export interface SkillCategory extends EvidenceStatus {
  id: string;
  label: BilingualText;
  /** 分类下的一句补充说明 */
  note?: BilingualText;
  /** 结构化分组展示；未提供时回退到扁平的 items */
  groups?: SkillGroup[];
  items: SkillEntry[];
}

/** 证书与专利：不是评奖，单独成一个证据类型 */
export type CredentialKind = "certificate" | "patent" | "paper";

export interface Credential extends EvidenceStatus {
  id: string;
  kind: CredentialKind;
  title: BilingualText;
  issuer: BilingualText;
  year?: string;
}

/** 实践经历中的一条分项工作内容；metric 为可选的核心量化成果（主题色加粗展示） */
export interface PracticeBullet {
  text: BilingualText;
  metric?: BilingualText;
}

/** 实践经历中的一个职务/项目条目 */
export interface PracticeEntry {
  id: string;
  /** 职务或项目名称 */
  title: BilingualText;
  /** 岗位角色，可选（例如「驻场出差负责人」） */
  role?: BilingualText;
  /** 地点，可选（例如「文昌冯家湾」） */
  location?: BilingualText;
  /** 起止时间，例如 2020.09 – 2023.06 */
  period: BilingualText;
  bullets: PracticeBullet[];
}

/** 实践经历按阶段分组（本科阶段 / 硕士阶段） */
export interface PracticePhase {
  id: string;
  phase: BilingualText;
  entries: PracticeEntry[];
}

/** 「关于我」实践经历配图 */
export interface AboutGalleryImage {
  id: string;
  /** public 下的相对路径，例如 /images/about/practice-01.jpg */
  src: string;
  caption: BilingualText;
  alt: BilingualText;
}

export interface IdentityContact {
  id: string;
  label: BilingualText;
  value: BilingualText;
}

/**
 * 「关于我」与「联系我」的公开资料。
 * 只包含本人明确同意公开的内容：不含电话、生日、学号、住址等敏感信息。
 */
export interface AboutProfile extends EvidenceStatus {
  /** 求职意向方向 */
  jobTargets: BilingualText[];
  /** 一句话个人简介，用于首页首屏 */
  headline: BilingualText;
  /** 首页「个人简介」板块使用的精简版简介；完整版见 identity.bio 与 about 页 */
  summary: BilingualText;
  /** 政治面貌 */
  politicalStatus: BilingualText;
  /** 三大核心优势（可见性继承 AboutProfile，不单独标注） */
  strengths: Array<{
    id: string;
    title: BilingualText;
    description: BilingualText;
  }>;
  /** 实践经历：本科阶段与硕士阶段的学生工作、驻场经历 */
  practice: PracticePhase[];
  /** 实践经历配图（仅在 /[lang]/about 渲染） */
  practiceImages: AboutGalleryImage[];
  /** 可公开的联系方式（邮箱 / 微信 / 籍贯） */
  contactHeading: BilingualText;
  contactNote: BilingualText;
  contacts: IdentityContact[];
}
