import { about } from "@/src/data/profile/about";
import { awards } from "@/src/data/profile/awards";
import { competitions } from "@/src/data/profile/competitions";
import { credentials } from "@/src/data/profile/credentials";
import { education } from "@/src/data/profile/education";
import { identity } from "@/src/data/profile/identity";
import { patents } from "@/src/data/profile/patents";
import { projects, findProjectBySlug, sortProjects } from "@/src/data/profile/projects";
import { publications } from "@/src/data/profile/publications";
import { research } from "@/src/data/profile/research";
import { skills } from "@/src/data/profile/skills";
import type {
  ContactKind,
  ContactPoint,
  Project,
  Publication,
  SkillCategory,
} from "@/src/data/profile/types";
import { isPublicVerified } from "@/src/data/profile/visibility";

export { isPublicVerified } from "@/src/data/profile/visibility";

export const publicIdentity = isPublicVerified(identity)
  ? {
      ...identity,
      contacts: identity.contacts.filter(isPublicVerified),
    }
  : null;
export const publicContacts: ContactPoint[] = publicIdentity?.contacts ?? [];
export const publicAbout = isPublicVerified(about) ? about : null;
export const publicEducation = education.filter(isPublicVerified);
export const publicResearchAreas = isPublicVerified(research)
  ? research.areas.filter(isPublicVerified)
  : [];
export const publicProjects = projects.filter(isPublicVerified);
export const publicPublications = publications.filter(isPublicVerified);
export const publicPatents = patents.filter(isPublicVerified);
export const publicAwards = awards.filter(isPublicVerified);
export const publicCompetitions = competitions.filter(isPublicVerified);
export const publicCredentials = credentials.filter(isPublicVerified);

/**
 * 取某个公开项目关联的公开论文，供项目卡片做「成果发表于EI会议」标注。
 * 绑定到 publicPublications，调用方无需自行传入论文集合。
 */
export function getProjectsPublications(project: {
  slug: string;
}): Publication[] {
  return publicPublications.filter((publication) =>
    (publication.relatedProjectSlugs ?? []).includes(project.slug)
  );
}

export function getPublicContact(kind: ContactKind): ContactPoint | null {
  return publicContacts.find((contact) => contact.kind === kind) ?? null;
}

export function getContactHref(contact: ContactPoint): string {
  if (contact.kind === "email") return `mailto:${contact.value}`;
  if (contact.kind === "phone") return `tel:${contact.value}`;
  return contact.value;
}

export const publicSkills: SkillCategory[] = skills
  .filter(isPublicVerified)
  .map((category) => ({
    ...category,
    groups: category.groups
      ?.map((group) => ({
        ...group,
        items: group.items.filter(isPublicVerified),
      }))
      .filter((group) => group.items.length > 0),
    items: category.items.filter(isPublicVerified),
  }))
  .filter((category) => category.items.length > 0);

export function getSortedPublicProjects(): Project[] {
  return sortProjects(publicProjects);
}

export function getPublicProjectBySlug(slug: string): Project | null {
  return findProjectBySlug(publicProjects, slug);
}

export const publicProfileData = {
  identity: publicIdentity,
  about: publicAbout,
  contacts: publicContacts,
  education: publicEducation,
  research: publicResearchAreas,
  projects: publicProjects,
  publications: publicPublications,
  patents: publicPatents,
  skills: publicSkills,
  awards: publicAwards,
  competitions: publicCompetitions,
  credentials: publicCredentials,
};
