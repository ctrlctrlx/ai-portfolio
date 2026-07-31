import { awards } from "@/src/data/profile/awards";
import { education } from "@/src/data/profile/education";
import { identity } from "@/src/data/profile/identity";
import { projects } from "@/src/data/profile/projects";
import { publications } from "@/src/data/profile/publications";
import { research } from "@/src/data/profile/research";
import { skills } from "@/src/data/profile/skills";

export const profileData = {
  identity,
  education,
  research,
  projects,
  publications,
  skills,
  awards,
};

export * from "@/src/data/profile/types";
export { awards } from "@/src/data/profile/awards";
export { education } from "@/src/data/profile/education";
export { identity } from "@/src/data/profile/identity";
export {
  getProjectBySlug,
  getSortedProjects,
  projects,
} from "@/src/data/profile/projects";
export {
  formatAuthors,
  publications,
} from "@/src/data/profile/publications";
export { research } from "@/src/data/profile/research";
export { skills } from "@/src/data/profile/skills";
