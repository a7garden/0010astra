import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import { Link } from 'react-router-dom';
import { concepts, getBySlug } from '../data';
import { Anchor, Text as MantineText } from '@mantine/core';

interface WikiLinkRendererProps {
  slug: string;
  display: string;
}

function WikiLinkRenderer({ slug, display }: WikiLinkRendererProps) {
  const exists = concepts.some((c) => c.slug === slug);
  if (exists) {
    return (
      <Anchor component={Link} to={`/concepts/${slug}`} c="violet">
        {display}
      </Anchor>
    );
  }
  return <MantineText span c="red">{display} (missing)</MantineText>;
}

function processWikiLinks(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    const linkTitle = match[1].trim();
    const displayText = match[2]?.trim() || linkTitle;

    // Try to resolve to a slug
    const concept = getBySlug(linkTitle);
    const slug = concept?.slug || linkTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    parts.push(<WikiLinkRenderer key={match.index} slug={slug} display={displayText} />);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

// Custom component to handle wiki-links inside markdown
function WikiParagraph({ children }: { children: React.ReactNode }) {
  const processed = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return <>{processWikiLinks(child)}</>;
    }
    return child;
  });
  return <p>{processed}</p>;
}

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Pre-process wiki-links into HTML anchor tags so react-markdown can handle them
  // Actually, we'll use a custom remark plugin approach via components

  const components = {
    p: ({ children }: { children?: React.ReactNode }) => {
      const processed = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <>{processWikiLinks(child)}</>;
        }
        return child;
      });
      return <p>{processed}</p>;
    },
    li: ({ children }: { children?: React.ReactNode }) => {
      const processed = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <>{processWikiLinks(child)}</>;
        }
        return child;
      });
      return <li>{processed}</li>;
    },
    td: ({ children }: { children?: React.ReactNode }) => {
      const processed = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <>{processWikiLinks(child)}</>;
        }
        return child;
      });
      return <td>{processed}</td>;
    },
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      if (!href) return <span>{children}</span>;
      // Wiki links are already handled above, so this is for regular links
      return (
        <Anchor href={href} target="_blank" rel="noopener noreferrer" c="blue">
          {children}
        </Anchor>
      );
    },
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote style={{
        borderLeft: '3px solid var(--mantine-color-violet-5)',
        paddingLeft: '1rem',
        marginLeft: 0,
        color: 'var(--mantine-color-dimmed)',
        fontStyle: 'italic',
      }}>
        {children}
      </blockquote>
    ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]]}
      components={components as any}
    >
      {content}
    </ReactMarkdown>
  );
}
