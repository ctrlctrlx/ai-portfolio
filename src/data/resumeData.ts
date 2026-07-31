import {
  awards,
  education,
  formatAuthors,
  getProjectBySlug,
  getSortedProjects,
  identity,
  projects,
  publications,
  research,
  skills,
} from "@/src/data/profile";

// Compatibility adapter for existing UI consumers.
// New code should import the relevant domain directly from src/data/profile.
export const resumeData = {
  personalInfo: identity,
  education,
  publications,
  skills,
  projects,
  awards,
  interviewFocus: research.interviewContext,
};

export {
  formatAuthors,
  getProjectBySlug,
  getSortedProjects,
};

export type {
  Author,
  Award,
  BilingualText,
  EducationEntry,
  Project,
  Publication,
  SocialLink,
} from "@/src/data/profile";
