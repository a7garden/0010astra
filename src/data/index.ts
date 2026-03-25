import conceptsData from './concepts.json';
import metaData from './meta.json';
import type { Concept, SiteMeta } from '../types';

export const concepts: Concept[] = conceptsData as Concept[];
export const meta: SiteMeta = metaData as SiteMeta;

const slugMap = new Map<string, Concept>();
for (const c of concepts) {
  slugMap.set(c.slug, c);
  slugMap.set(c.title.toLowerCase(), c);
  for (const alias of c.aliases) {
    slugMap.set(alias.toLowerCase(), c);
  }
}

export function getBySlug(slug: string): Concept | undefined {
  return slugMap.get(slug) ?? concepts.find((c) => c.slug === slug);
}

export function search(query: string): Concept[] {
  const q = query.toLowerCase().trim();
  if (!q) return concepts;
  return concepts.filter((c) => {
    return (
      c.title.toLowerCase().includes(q) ||
      c.aliases.some((a) => a.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.body.toLowerCase().includes(q)
    );
  });
}

export function getByCategory(category: string): Concept[] {
  if (!category) return concepts;
  return concepts.filter((c) => c.category === category);
}

export function getByTag(tag: string): Concept[] {
  if (!tag) return concepts;
  return concepts.filter((c) => c.tags.includes(tag));
}

export function getCategories(): string[] {
  return Object.keys(meta.categories).sort();
}

export function getTags(): string[] {
  return Object.keys(meta.tags).sort();
}
