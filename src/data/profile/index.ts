import { about } from "@/src/data/profile/about";
import { awards } from "@/src/data/profile/awards";
import { competitions } from "@/src/data/profile/competitions";
import { credentials } from "@/src/data/profile/credentials";
import { education } from "@/src/data/profile/education";
import { identity } from "@/src/data/profile/identity";
import { patents } from "@/src/data/profile/patents";
import { projects } from "@/src/data/profile/projects";
import { publications } from "@/src/data/profile/publications";
import { research } from "@/src/data/profile/research";
import { skills } from "@/src/data/profile/skills";

export const profileData = {
  identity,
  about,
  education,
  research,
  projects,
  publications,
  patents,
  skills,
  awards,
  competitions,
  credentials,
};

export * from "@/src/data/profile/types";
export { about } from "@/src/data/profile/about";
export {
  awardLevelLabels,
  awardLevelOrder,
  awards,
} from "@/src/data/profile/awards";
export { competitions } from "@/src/data/profile/competitions";
export { credentials } from "@/src/data/profile/credentials";
export { education } from "@/src/data/profile/education";
export { identity } from "@/src/data/profile/identity";
export { patents } from "@/src/data/profile/patents";
export {
  findProjectBySlug,
  getProjectTechTags,
  projects,
  sortProjects,
} from "@/src/data/profile/projects";
export {
  getPublicationAuthors,
  publications,
} from "@/src/data/profile/publications";
export * from "@/src/data/profile/public";
export { research } from "@/src/data/profile/research";
export { skills } from "@/src/data/profile/skills";
export { isPublicVerified } from "@/src/data/profile/visibility";
