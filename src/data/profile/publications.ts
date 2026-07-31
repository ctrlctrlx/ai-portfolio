import type { Publication } from "@/src/data/profile/types";

// Keep this section empty until a complete record is explicitly verified.
export const publications: Publication[] = [];

export function formatAuthors(
  publication: Publication
): { name: string; isHighlighted: boolean }[] {
  return publication.authors.map((author) => ({
    name: author.name,
    isHighlighted: author.isHighlighted ?? false,
  }));
}
