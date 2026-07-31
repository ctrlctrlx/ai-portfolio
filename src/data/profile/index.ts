import { awards } from "@/src/data/profile/awards";
import { education } from "@/src/data/profile/education";
import { identity } from "@/src/data/profile/identity";
import { projects } from "@/src/data/profile/projects";
import { patents, publications } from "@/src/data/profile/publications";
import { research } from "@/src/data/profile/research";
import { skills } from "@/src/data/profile/skills";

export const profileData = {
  identity,
  education,
  research,
  projects,
  publications,
  patents,
  skills,
  awards,
};

export * from "@/src/data/profile/types";
export { awards } from "@/src/data/profile/awards";
export { education } from "@/src/data/profile/education";
export { identity } from "@/src/data/profile/identity";
export {
  findProjectBySlug,
  projects,
  sortProjects,
} from "@/src/data/profile/projects";
export {
  formatAuthors,
  patents,
  publications,
} from "@/src/data/profile/publications";
export * from "@/src/data/profile/public";
export { research } from "@/src/data/profile/research";
export { skills } from "@/src/data/profile/skills";
export { isPublicVerified } from "@/src/data/profile/visibility";
