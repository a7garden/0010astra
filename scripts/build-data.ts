import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONCEPTS_DIR = process.env.ASTRA_PATH
  ? path.join(process.env.ASTRA_PATH, 'concepts')
  : '/Volumes/SATECHI DISK/Code/repos/astra/concepts';
const OUTPUT_DIR = path.resolve('src/data');

interface Concept {
  slug: string;
  title: string;
  aliases: string[];
  category: string;
  tags: string[];
  related: string[];
  created: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  body: string;
  backlinks: string[];
}

function slugify(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function main() {
  if (!fs.existsSync(CONCEPTS_DIR)) {
    console.error(`Concepts directory not found: ${CONCEPTS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CONCEPTS_DIR).filter((f) => f.endsWith('.md'));

  if (files.length === 0) {
    console.warn('No .md files found in concepts directory');
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUTPUT_DIR, 'concepts.json'), '[]');
    return;
  }

  const concepts: Concept[] = [];
  const titleToSlugMap = new Map<string, string>();

  // First pass: parse all files and build title→slug map
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONCEPTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const slug = slugify(file);
    const title = data.title || slug;

    titleToSlugMap.set(title.toLowerCase(), slug);
    if (data.aliases && Array.isArray(data.aliases)) {
      for (const alias of data.aliases) {
        titleToSlugMap.set(alias.toLowerCase(), slug);
      }
    }

    concepts.push({
      slug,
      title,
      aliases: data.aliases || [],
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
      related: data.related || [],
      created: data.created || '',
      source: data.source || '',
      confidence: data.confidence || 'medium',
      body: content.trim(),
      backlinks: [],
    });
  }

  // Second pass: resolve wiki-links and build backlinks
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

  for (const concept of concepts) {
    // Resolve [[Wiki Link]] in body → also check related array
    const links: string[] = [];

    // From body
    let match: RegExpExecArray | null;
    const bodyCopy = concept.body;
    while ((match = wikiLinkRegex.exec(bodyCopy)) !== null) {
      const linkTitle = match[1].trim();
      const resolved = titleToSlugMap.get(linkTitle.toLowerCase());
      if (resolved) links.push(resolved);
    }

    // From related
    for (const rel of concept.related) {
      const resolved = titleToSlugMap.get(rel.toLowerCase());
      if (resolved) links.push(resolved);
    }

    concept.backlinks = [...new Set(links)];
  }

  // Build backlinks (reverse): who links TO me
  const backlinkIndex = new Map<string, string[]>();
  for (const concept of concepts) {
    const bodyCopy = concept.body;
    let match: RegExpExecArray | null;
    wikiLinkRegex.lastIndex = 0;
    while ((match = wikiLinkRegex.exec(bodyCopy)) !== null) {
      const linkTitle = match[1].trim();
      const resolved = titleToSlugMap.get(linkTitle.toLowerCase());
      if (resolved && resolved !== concept.slug) {
        if (!backlinkIndex.has(resolved)) backlinkIndex.set(resolved, []);
        backlinkIndex.get(resolved)!.push(concept.slug);
      }
    }
  }

  // Merge backlinks into concepts
  for (const concept of concepts) {
    const incoming = backlinkIndex.get(concept.slug) || [];
    concept.backlinks = [...new Set([...concept.backlinks, ...incoming])];
  }

  // Build metadata for home page
  const categories = new Map<string, number>();
  const allTags = new Map<string, number>();

  for (const c of concepts) {
    categories.set(c.category, (categories.get(c.category) || 0) + 1);
    for (const tag of c.tags) {
      allTags.set(tag, (allTags.get(tag) || 0) + 1);
    }
  }

  // Sort by created date descending, then alphabetically
  const sorted = [...concepts].sort((a, b) => {
    const aDate = String(a.created);
    const bDate = String(b.created);
    if (aDate && bDate) return bDate.localeCompare(aDate);
    return a.title.localeCompare(b.title);
  });

  const recent = sorted.slice(0, 10);

  // Write output
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'concepts.json'),
    JSON.stringify(sorted, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'meta.json'),
    JSON.stringify({
      total: concepts.length,
      categories: Object.fromEntries(categories),
      tags: Object.fromEntries(allTags),
      recent: recent.map((c) => c.slug),
    }, null, 2)
  );

  console.log(`✅ Built ${concepts.length} concepts → src/data/`);
}

main();
