export interface BilingualText {
  zh: string;
  en: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface EducationEntry {
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

export interface Publication {
  id: string;
  title: string;
  authors: Author[];
  venue: BilingualText;
  year: number;
  abstract: BilingualText;
  tags: string[];
  doi?: string;
  arxivUrl?: string;
  patentNo?: string;
  type: "paper" | "patent";
}

export interface Project {
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

export interface Award {
  title: BilingualText;
  issuer: BilingualText;
  year: string;
}
