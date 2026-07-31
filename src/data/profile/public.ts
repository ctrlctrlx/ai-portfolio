import { awards } from "@/src/data/profile/awards";
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
export const publicEducation = education.filter(isPublicVerified);
export const publicResearchAreas = isPublicVerified(research)
  ? research.areas.filter(isPublicVerified)
  : [];
export const publicProjects = projects.filter(isPublicVerified);
export const publicPublications = publications.filter(isPublicVerified);
export const publicPatents = patents.filter(isPublicVerified);
export const publicAwards = awards.filter(isPublicVerified);

export function getPublicContact(kind: ContactKind): ContactPoint | null {
  return publicContacts.find((contact) => contact.kind === kind) ?? null;
}

export function getContactHref(contact: ContactPoint): string {
  return contact.kind === "email"
    ? `mailto:${contact.value}`
    : contact.value;
}

export const publicSkills: SkillCategory[] = skills
  .filter(isPublicVerified)
  .map((category) => ({
    ...category,
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
  contacts: publicContacts,
  education: publicEducation,
  research: publicResearchAreas,
  projects: publicProjects,
  publications: publicPublications,
  patents: publicPatents,
  skills: publicSkills,
  awards: publicAwards,
};
