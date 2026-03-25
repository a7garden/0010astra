export interface Concept {
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

export interface SiteMeta {
  total: number;
  categories: Record<string, number>;
  tags: Record<string, number>;
  recent: string[];
}
