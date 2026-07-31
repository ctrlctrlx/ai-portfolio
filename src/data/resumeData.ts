import {
  formatAuthors,
  getPublicProjectBySlug,
  getSortedPublicProjects,
  publicAwards,
  publicEducation,
  publicIdentity,
  publicProjects,
  publicPublications,
  publicResearchAreas,
  publicSkills,
} from "@/src/data/profile";

// Legacy compatibility adapter. It derives every value from the Profile data
// layer; new code must import the relevant public domain collection directly.
export const resumeData = {
  personalInfo: publicIdentity,
  education: publicEducation,
  publications: publicPublications,
  skills: publicSkills,
  projects: publicProjects,
  awards: publicAwards,
  interviewFocus: publicResearchAreas,
};

export {
  formatAuthors,
  getPublicProjectBySlug as getProjectBySlug,
  getSortedPublicProjects as getSortedProjects,
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
